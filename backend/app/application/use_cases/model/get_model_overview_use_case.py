import json
from pathlib import Path

from app.domain.repositories.model_repository import ModelRepository
from app.domain.repositories.validation_repository import ValidationRepository


class GetModelOverviewUseCase:
    def __init__(
        self,
        model_repo: ModelRepository,
        validation_repo: ValidationRepository,
        model_output_dir: Path,
    ) -> None:
        self.model_repo = model_repo
        self.validation_repo = validation_repo
        self.model_output_dir = model_output_dir
        self.project_data_dir = model_output_dir.parent

    def _resolve_data_path(self, value: str | None, default_path: Path) -> Path:
        if value is None or str(value).strip() == "":
            return default_path
        p = Path(value)
        if p.is_absolute():
            return p
        return self.project_data_dir / p

    @staticmethod
    def _load_json(path: Path):
        if not path.exists():
            return None
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return None

    @staticmethod
    def _safe_size(path: Path) -> int:
        try:
            return path.stat().st_size if path.exists() else 0
        except OSError:
            return 0

    @staticmethod
    def _dataset_summary(records: list[dict]) -> dict:
        devices = sorted({str(r.get("emitter_device_id", "")).strip() for r in records if r.get("emitter_device_id")})
        sessions = sorted({f"{r.get('emitter_device_id', '')}:{r.get('session_id', '')}" for r in records if r.get("session_id")})
        sample_rates = sorted({float(r.get("sample_rate_hz", 0)) for r in records if r.get("sample_rate_hz") is not None})
        center_freqs = sorted({float(r.get("center_frequency_hz", 0)) for r in records if r.get("center_frequency_hz") is not None})
        return {
            "records": len(records),
            "devices": len(devices),
            "sessions": len(sessions),
            "device_ids": devices,
            "sample_rates_hz": sample_rates,
            "center_frequencies_hz": center_freqs,
        }

    @staticmethod
    def _history_summary(history: list[dict]) -> dict:
        if not history:
            return {
                "epochs": 0,
                "best_test_acc": 0.0,
                "last_test_acc": 0.0,
                "last_train_acc": 0.0,
                "best_epoch": None,
                "start_modes": [],
            }

        best_row = max(history, key=lambda row: float(row.get("test_acc", 0.0)))
        last_row = history[-1]
        return {
            "epochs": len(history),
            "best_test_acc": float(best_row.get("test_acc", 0.0)),
            "last_test_acc": float(last_row.get("test_acc", 0.0)),
            "last_train_acc": float(last_row.get("train_acc", 0.0)),
            "best_epoch": int(best_row.get("epoch", 0)) if best_row.get("epoch") is not None else None,
            "start_modes": sorted({str(row.get("mode", "")).strip() for row in history if row.get("mode")}),
        }

    def execute(self, payload: dict | None = None) -> dict:
        payload = payload or {}
        model_dir = self._resolve_data_path(payload.get("model_dir"), self.model_output_dir)
        versions_dir = model_dir / "versions"
        best_model_path = model_dir / "best_model.pt"
        history_path = model_dir / "training_history.json"
        manifest_path = model_dir / "dataset_manifest.json"
        profiles_path = model_dir / "enrollment_profiles.json"
        label_map_path = model_dir / "label_map.json"
        train_config_path = model_dir / "train_config.json"
        version_index_path = versions_dir / "index.json"

        manifest = self._load_json(manifest_path) or {}
        history = self._load_json(history_path) or []
        profiles = self._load_json(profiles_path) or {}
        label_map = self._load_json(label_map_path) or {}
        train_config = self._load_json(train_config_path) or {}
        version_index = self._load_json(version_index_path) or {}

        records = manifest.get("records", []) if isinstance(manifest, dict) else []
        if not isinstance(records, list):
            records = []

        versions = version_index.get("versions", []) if isinstance(version_index, dict) else []
        if not isinstance(versions, list):
            versions = []

        retrain_versions = [v for v in versions if str(v.get("reason", "")).strip() == "after_update"]
        previous_versions = [v for v in versions if str(v.get("reason", "")).strip() == "before_update"]
        latest_snapshot = versions[-1] if versions else None

        device_to_label = label_map.get("device_to_label", {}) if isinstance(label_map, dict) else {}
        profiles_count = len(profiles) if isinstance(profiles, dict) else 0

        validation_runs = []
        for result in self.validation_repo.list_all():
            report = self._load_json(Path(result.report_path))
            validation_runs.append({
                "run_id": result.run_id,
                "model_version": result.model_version,
                "accuracy": result.accuracy,
                "macro_f1": result.macro_f1,
                "report_path": result.report_path,
                "report": report,
            })

        registered_models = [item.__dict__ for item in self.model_repo.list_versions()]
        latest_validation = validation_runs[-1] if validation_runs else None

        return {
            "model_dir": str(model_dir),
            "current_model": {
                "path": str(best_model_path),
                "exists": best_model_path.exists(),
                "size_bytes": self._safe_size(best_model_path),
            },
            "artifacts": {
                "best_model": {"path": str(best_model_path), "exists": best_model_path.exists(), "size_bytes": self._safe_size(best_model_path)},
                "training_history": {"path": str(history_path), "exists": history_path.exists(), "size_bytes": self._safe_size(history_path)},
                "dataset_manifest": {"path": str(manifest_path), "exists": manifest_path.exists(), "size_bytes": self._safe_size(manifest_path)},
                "enrollment_profiles": {"path": str(profiles_path), "exists": profiles_path.exists(), "size_bytes": self._safe_size(profiles_path)},
                "label_map": {"path": str(label_map_path), "exists": label_map_path.exists(), "size_bytes": self._safe_size(label_map_path)},
                "train_config": {"path": str(train_config_path), "exists": train_config_path.exists(), "size_bytes": self._safe_size(train_config_path)},
            },
            "dataset": self._dataset_summary(records),
            "training": {
                **self._history_summary(history if isinstance(history, list) else []),
                "config": train_config if isinstance(train_config, dict) else {},
                "profiles_count": profiles_count,
                "labeled_devices": len(device_to_label) if isinstance(device_to_label, dict) else 0,
                "latest_history": history[-20:] if isinstance(history, list) else [],
            },
            "retraining": {
                "has_retraining": len(retrain_versions) > 0,
                "retrain_count": len(retrain_versions),
                "pre_update_snapshots": len(previous_versions),
                "latest_snapshot": latest_snapshot,
                "snapshots": versions,
            },
            "inventory": {
                "registered_models": registered_models,
                "registered_model_count": len(registered_models),
                "snapshot_count": len(versions),
                "has_multiple_models": len(versions) > 1 or len(registered_models) > 1,
            },
            "prediction_readiness": {
                "has_model_file": best_model_path.exists(),
                "has_profiles": profiles_path.exists(),
                "has_manifest": manifest_path.exists(),
                "has_history": history_path.exists(),
                "has_validation": latest_validation is not None,
                "latest_validation": latest_validation,
            },
            "validation_runs": validation_runs,
        }
