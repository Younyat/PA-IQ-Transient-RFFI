import { Link } from "react-router-dom";
import { AppRouter } from "./router";
import { AppProviders } from "./providers/AppProviders";
import { usePreferences } from "./providers/PreferencesProvider";

const navItems = [
  { to: "/", key: "nav.dashboard" },
  { to: "/capture", key: "nav.capture" },
  { to: "/dataset", key: "nav.dataset" },
  { to: "/training", key: "nav.training" },
  { to: "/retraining", key: "nav.retraining" },
  { to: "/validation", key: "nav.validation" },
  { to: "/inference", key: "nav.inference" },
  { to: "/models", key: "nav.models" },
];

function AppShell() {
  const { language, setLanguage, theme, setTheme, t } = usePreferences();

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <div className="app-kicker">RF ML</div>
          <h1>{t("app.title")}</h1>
          <p className="app-subtitle">{t("app.subtitle")}</p>
        </div>
        <div className="toolbar">
          <label className="toolbar-field">
            <span>{t("prefs.language")}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value as "es" | "en" | "ar")}>
              <option value="es">{t("prefs.language.es")}</option>
              <option value="en">{t("prefs.language.en")}</option>
              <option value="ar">{t("prefs.language.ar")}</option>
            </select>
          </label>
          <label className="toolbar-field">
            <span>{t("prefs.theme")}</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value as "system" | "light" | "dark")}>
              <option value="system">{t("prefs.theme.system")}</option>
              <option value="light">{t("prefs.theme.light")}</option>
              <option value="dark">{t("prefs.theme.dark")}</option>
            </select>
          </label>
        </div>
      </header>
      <nav className="nav-bar">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className="nav-link">
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <AppRouter />
    </main>
  );
}

export function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
