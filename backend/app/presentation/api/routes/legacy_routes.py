from fastapi import APIRouter, Depends

from app.infrastructure.di.container import get_container

router = APIRouter(tags=["legacy"])


@router.get("/device/status")
def device_status(container=Depends(get_container)):
    job = container.capture_controller.status()
    status = str(job.get("status", "unknown"))
    return {
        "status": status,
        "connected": status != "not_found",
        "job_id": job.get("job_id"),
        "detail": job,
    }


@router.get("/recordings/")
def recordings(container=Depends(get_container)):
    return container.capture_controller.list_all()


@router.get("/sessions/")
def sessions(container=Depends(get_container)):
    records = container.dataset_controller.list_records(split=None)
    grouped: dict[tuple[str, str], dict] = {}

    for record in records:
        emitter = str(record.get("emitter_device_id", "")).strip()
        session_id = str(record.get("session_id", "")).strip()
        split = str(record.get("split", "")).strip()
        key = (emitter, session_id)
        current = grouped.get(key)
        if current is None:
            grouped[key] = {
                "emitter_device_id": emitter,
                "session_id": session_id,
                "splits": [split] if split else [],
                "records": 1,
            }
            continue

        current["records"] += 1
        if split and split not in current["splits"]:
            current["splits"].append(split)

    return sorted(grouped.values(), key=lambda item: (item["emitter_device_id"], item["session_id"]))


@router.get("/presets/")
def presets():
    return [
        {
            "id": "default-train",
            "name": "Default Train Capture",
            "split": "train",
            "frequency_mhz": 89.4,
            "sample_rate_hz": 10_000_000,
            "duration_seconds": 5.0,
            "gain_db": 20.0,
        },
        {
            "id": "default-val",
            "name": "Default Validation Capture",
            "split": "val",
            "frequency_mhz": 89.4,
            "sample_rate_hz": 10_000_000,
            "duration_seconds": 5.0,
            "gain_db": 20.0,
        },
        {
            "id": "default-predict",
            "name": "Default Prediction Capture",
            "split": "predict",
            "frequency_mhz": 89.4,
            "sample_rate_hz": 10_000_000,
            "duration_seconds": 5.0,
            "gain_db": 20.0,
        },
    ]
