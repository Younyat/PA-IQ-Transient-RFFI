import { Link } from "react-router-dom";
import { usePreferences } from "../../app/providers/PreferencesProvider";

export function DashboardView() {
  const { t } = usePreferences();

  return (
    <div className="grid grid-2">
      <div className="panel">
        <h3>{t("dashboard.capture.title")}</h3>
        <p>{t("dashboard.capture.body")}</p>
        <Link to="/capture">{t("dashboard.capture.cta")}</Link>
      </div>
      <div className="panel">
        <h3>{t("dashboard.training.title")}</h3>
        <p>{t("dashboard.training.body")}</p>
        <Link to="/training">{t("dashboard.training.cta")}</Link>
      </div>
      <div className="panel">
        <h3>{t("dashboard.retraining.title")}</h3>
        <p>{t("dashboard.retraining.body")}</p>
        <Link to="/retraining">{t("dashboard.retraining.cta")}</Link>
      </div>
      <div className="panel">
        <h3>{t("dashboard.validation.title")}</h3>
        <p>{t("dashboard.validation.body")}</p>
        <Link to="/validation">{t("dashboard.validation.cta")}</Link>
      </div>
      <div className="panel">
        <h3>{t("dashboard.dataset.title")}</h3>
        <p>{t("dashboard.dataset.body")}</p>
        <Link to="/dataset">{t("dashboard.dataset.cta")}</Link>
      </div>
    </div>
  );
}
