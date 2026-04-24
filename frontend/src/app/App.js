import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("main", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsxs("div", { children: [_jsx("div", { className: "app-kicker", children: "RF ML" }), _jsx("h1", { children: t("app.title") }), _jsx("p", { className: "app-subtitle", children: t("app.subtitle") })] }), _jsxs("div", { className: "toolbar", children: [_jsxs("label", { className: "toolbar-field", children: [_jsx("span", { children: t("prefs.language") }), _jsxs("select", { value: language, onChange: (e) => setLanguage(e.target.value), children: [_jsx("option", { value: "es", children: t("prefs.language.es") }), _jsx("option", { value: "en", children: t("prefs.language.en") }), _jsx("option", { value: "ar", children: t("prefs.language.ar") })] })] }), _jsxs("label", { className: "toolbar-field", children: [_jsx("span", { children: t("prefs.theme") }), _jsxs("select", { value: theme, onChange: (e) => setTheme(e.target.value), children: [_jsx("option", { value: "system", children: t("prefs.theme.system") }), _jsx("option", { value: "light", children: t("prefs.theme.light") }), _jsx("option", { value: "dark", children: t("prefs.theme.dark") })] })] })] })] }), _jsx("nav", { className: "nav-bar", children: navItems.map((item) => (_jsx(Link, { to: item.to, className: "nav-link", children: t(item.key) }, item.to))) }), _jsx(AppRouter, {})] }));
}
export function App() {
    return (_jsx(AppProviders, { children: _jsx(AppShell, {}) }));
}
