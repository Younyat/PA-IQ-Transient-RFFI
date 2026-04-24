import { usePreferences } from "../../app/providers/PreferencesProvider";
import { buildScientificSummary } from "../components/validation/types";
import { useModels } from "../hooks/useModels";

function pct(value: number | undefined) {
  return `${((value ?? 0) * 100).toFixed(2)}%`;
}

function formatBytes(value: number | undefined) {
  const bytes = value ?? 0;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function boolLabel(value: boolean, ok: string, missing: string) {
  return value ? ok : missing;
}

function renderList(values: Array<string | number> | undefined) {
  if (!values || values.length === 0) return "—";
  return values.join(", ");
}

export function ModelRegistryView() {
  const { data, loading, error, reload } = useModels();
  const { t } = usePreferences();

  if (loading) return <div className="panel">{t("models.loading")}</div>;

  if (error) {
    return (
      <div className="panel">
        <div className="validation-summary-top">
          <h3>{t("models.error")}</h3>
          <button onClick={() => void reload()}>{t("models.refresh")}</button>
        </div>
        <pre className="log-box error-log">{error}</pre>
      </div>
    );
  }

  if (!data) return <div className="panel">{t("models.empty")}</div>;

  const latestValidationReport = data.prediction_readiness?.latest_validation?.report;
  const validationSummary = latestValidationReport ? buildScientificSummary(latestValidationReport) : null;
  const snapshots = Array.isArray(data.retraining?.snapshots) ? data.retraining.snapshots : [];
  const history = Array.isArray(data.training?.latest_history) ? data.training.latest_history : [];
  const artifactEntries = Object.entries(data.artifacts || {});

  return (
    <div className="grid">
      <section className="panel validation-hero">
        <div>
          <h3>{t("models.hero.title")}</h3>
          <p>{t("models.hero.body")}</p>
        </div>
        <div className="validation-hero-badge">{t("models.hero.badge")}</div>
      </section>

      <section className="panel">
        <div className="validation-summary-top">
          <h3>{t("models.section.overview")}</h3>
          <button onClick={() => void reload()}>{t("models.refresh")}</button>
        </div>
        <div className="validation-kpi-grid">
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.modelSize")}</div><div className="kpi-value">{formatBytes(data.current_model?.size_bytes)}</div></div>
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.devices")}</div><div className="kpi-value">{data.dataset?.devices ?? 0}</div></div>
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.records")}</div><div className="kpi-value">{data.dataset?.records ?? 0}</div></div>
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.retrains")}</div><div className="kpi-value">{data.retraining?.retrain_count ?? 0}</div></div>
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.bestAcc")}</div><div className="kpi-value">{pct(data.training?.best_test_acc)}</div></div>
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.lastAcc")}</div><div className="kpi-value">{pct(data.training?.last_test_acc)}</div></div>
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.snapshots")}</div><div className="kpi-value">{data.inventory?.snapshot_count ?? 0}</div></div>
          <div className="validation-kpi"><div className="kpi-label">{t("models.kpi.validation")}</div><div className="kpi-value">{boolLabel(!!data.prediction_readiness?.has_validation, t("models.label.status.ok"), t("models.label.status.missing"))}</div></div>
        </div>
        <div className="model-detail-grid">
          <div className="model-detail-item"><strong>{t("models.label.path")}:</strong> <span className="small-path">{data.current_model?.path || "—"}</span></div>
          <div className="model-detail-item"><strong>{t("models.label.multipleModels")}:</strong> {boolLabel(!!data.inventory?.has_multiple_models, t("models.label.status.ok"), t("models.label.status.missing"))}</div>
          <div className="model-detail-item"><strong>{t("models.label.latestSnapshot")}:</strong> {data.retraining?.latest_snapshot?.version_id || "—"}</div>
          <div className="model-detail-item"><strong>{t("models.label.trainingMode")}:</strong> {renderList(data.training?.start_modes)}</div>
        </div>
      </section>

      <section className="panel">
        <h3>{t("models.section.dataset")}</h3>
        <div className="model-detail-grid">
          <div className="model-detail-item"><strong>{t("models.kpi.records")}:</strong> {data.dataset?.records ?? 0}</div>
          <div className="model-detail-item"><strong>{t("models.kpi.devices")}:</strong> {data.dataset?.devices ?? 0}</div>
          <div className="model-detail-item"><strong>Sessions:</strong> {data.dataset?.sessions ?? 0}</div>
          <div className="model-detail-item"><strong>Devices:</strong> {renderList(data.dataset?.device_ids)}</div>
          <div className="model-detail-item"><strong>{t("models.label.sampleRates")}:</strong> {renderList(data.dataset?.sample_rates_hz)}</div>
          <div className="model-detail-item"><strong>{t("models.label.centerFrequencies")}:</strong> {renderList(data.dataset?.center_frequencies_hz)}</div>
        </div>
      </section>

      <section className="panel">
        <h3>{t("models.section.training")}</h3>
        <div className="model-detail-grid">
          <div className="model-detail-item"><strong>Epochs:</strong> {data.training?.epochs ?? 0}</div>
          <div className="model-detail-item"><strong>{t("models.label.profiles")}:</strong> {data.training?.profiles_count ?? 0}</div>
          <div className="model-detail-item"><strong>{t("models.label.labeledDevices")}:</strong> {data.training?.labeled_devices ?? 0}</div>
          <div className="model-detail-item"><strong>Batch size:</strong> {data.training?.config?.batch_size ?? "—"}</div>
          <div className="model-detail-item"><strong>Window size:</strong> {data.training?.config?.window_size ?? "—"}</div>
          <div className="model-detail-item"><strong>Stride:</strong> {data.training?.config?.stride ?? "—"}</div>
          <div className="model-detail-item"><strong>LR:</strong> {data.training?.config?.lr ?? "—"}</div>
          <div className="model-detail-item"><strong>Embedding dim:</strong> {data.training?.config?.embedding_dim ?? "—"}</div>
        </div>
      </section>

      <section className="panel">
        <h3>{t("models.section.retraining")}</h3>
        <div className="model-detail-grid">
          <div className="model-detail-item"><strong>Retrained:</strong> {boolLabel(!!data.retraining?.has_retraining, t("models.label.status.ok"), t("models.label.status.missing"))}</div>
          <div className="model-detail-item"><strong>Retrain count:</strong> {data.retraining?.retrain_count ?? 0}</div>
          <div className="model-detail-item"><strong>Pre-update snapshots:</strong> {data.retraining?.pre_update_snapshots ?? 0}</div>
          <div className="model-detail-item"><strong>Registered models:</strong> {data.inventory?.registered_model_count ?? 0}</div>
        </div>
        <div className="validation-table-wrap">
          <table className="validation-table">
            <thead>
              <tr>
                <th>{t("models.table.version")}</th>
                <th>{t("models.table.reason")}</th>
                <th>{t("models.table.created")}</th>
                <th>{t("models.table.snapshotDir")}</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snapshot: any) => (
                <tr key={String(snapshot.version_id)}>
                  <td>{snapshot.version_id}</td>
                  <td>{snapshot.reason}</td>
                  <td>{snapshot.created_at_utc}</td>
                  <td className="small-path">{snapshot.snapshot_dir}</td>
                </tr>
              ))}
              {snapshots.length === 0 && (
                <tr>
                  <td colSpan={4}>{t("models.empty")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3>{t("models.section.validation")}</h3>
        <div className={data.prediction_readiness?.has_model_file && data.prediction_readiness?.has_profiles && data.prediction_readiness?.has_manifest && data.prediction_readiness?.has_history ? "validation-interpretation" : "validation-warnings"}>
          <strong>{t("models.label.predictionReadiness")}:</strong>{" "}
          {data.prediction_readiness?.has_model_file &&
          data.prediction_readiness?.has_profiles &&
          data.prediction_readiness?.has_manifest &&
          data.prediction_readiness?.has_history
            ? t("models.note.predictionReady")
            : t("models.note.predictionRisk")}
        </div>
        {validationSummary ? (
          <>
            <div className="validation-kpi-grid">
              <div className="validation-kpi"><div className="kpi-label">{t("models.label.validationQuality")}</div><div className="kpi-value">{validationSummary.qualityLabel}</div></div>
              <div className="validation-kpi"><div className="kpi-label">{t("models.label.recordAccuracy")}</div><div className="kpi-value">{pct(validationSummary.recordAccuracy)}</div></div>
              <div className="validation-kpi"><div className="kpi-label">{t("models.label.windowAccuracy")}</div><div className="kpi-value">{pct(validationSummary.windowAccuracy)}</div></div>
              <div className="validation-kpi"><div className="kpi-label">{t("models.label.acceptanceRate")}</div><div className="kpi-value">{pct(validationSummary.acceptanceRate)}</div></div>
              <div className="validation-kpi"><div className="kpi-label">{t("models.label.suspiciousRate")}</div><div className="kpi-value">{pct(validationSummary.suspiciousRate)}</div></div>
              <div className="validation-kpi"><div className="kpi-label">{t("models.label.meanDistance")}</div><div className="kpi-value">{validationSummary.meanDistanceToTrueProfile.toFixed(4)}</div></div>
              <div className="validation-kpi"><div className="kpi-label">{t("models.label.margin")}</div><div className="kpi-value">{validationSummary.meanDistanceMargin.toFixed(4)}</div></div>
            </div>
            <div className="validation-interpretation">
              <strong>Interpretation:</strong> {validationSummary.interpretation}
            </div>
          </>
        ) : (
          <div className="validation-warnings">{t("models.note.noValidation")}</div>
        )}
      </section>

      <section className="panel">
        <h3>{t("models.section.files")}</h3>
        <div className="validation-table-wrap">
          <table className="validation-table">
            <thead>
              <tr>
                <th>{t("models.table.file")}</th>
                <th>Status</th>
                <th>{t("models.table.size")}</th>
                <th>{t("models.label.path")}</th>
              </tr>
            </thead>
            <tbody>
              {artifactEntries.map(([name, artifact]: [string, any]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{boolLabel(!!artifact?.exists, t("models.label.status.ok"), t("models.label.status.missing"))}</td>
                  <td>{formatBytes(artifact?.size_bytes)}</td>
                  <td className="small-path">{artifact?.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3>{t("models.section.history")}</h3>
        <div className="validation-table-wrap">
          <table className="validation-table">
            <thead>
              <tr>
                <th>{t("models.table.epoch")}</th>
                <th>{t("models.table.trainAcc")}</th>
                <th>{t("models.table.testAcc")}</th>
                <th>{t("models.table.trainLoss")}</th>
                <th>{t("models.table.testLoss")}</th>
                <th>{t("models.table.mode")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row: any, index: number) => (
                <tr key={`${row.epoch}-${index}`}>
                  <td>{row.epoch}</td>
                  <td>{pct(row.train_acc)}</td>
                  <td>{pct(row.test_acc)}</td>
                  <td>{Number(row.train_loss ?? 0).toFixed(6)}</td>
                  <td>{Number(row.test_loss ?? 0).toFixed(6)}</td>
                  <td>{row.mode || "—"}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6}>{t("models.empty")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
