# Quark-Finance

Interfaz de finanzas personal con IA (Quark). Diseño futurista con dashboard, copilot, insights cuánticos, radar de riesgo, gemelo digital, predicciones Monte Carlo, misiones financieras, onboarding orbital y vista móvil.

## i18n / Traducción Español

Sistema de internacionalización en dos capas implementado:

- **Capa 1 — `t(key)`**: Diccionario por claves (`TRANSLATIONS.es`) en `auth.jsx`. ~370+ traducciones ES.
- **Capa 2 — `tr(string)`**: Traducción string-a-string basada en inglés. Fallback identity si no hay match.

### Componentes traducidos

| Archivo | Pantallas / Componentes | Estado |
|---|---|---|
| `auth.jsx` | Diccionario `TRANSLATIONS.es`, contexto `QLangProvider`, `useTr()` | ✅ |
| `primitives.jsx` | Sidebar (nav items, version), QTopbar, QSectionHead | ✅ |
| `screens.jsx` | Dashboard, AI Copilot, Insights feed, placeholders | ✅ |
| `screens2.jsx` | Risk Radar, Digital Twin, Predictions, Timeline | ✅ |
| `screens3.jsx` | Missions, AI Models, Onboarding (6 pasos), Mobile Dashboard, Mobile Quark | ✅ |
| `app-shell.jsx` | ScreenStub, MobilePreview, Spotlight (⌘K), OnboardingOverlay, QuarkRootInner | ✅ |
| `interactive.jsx` | ScreenSettings, ScreenWallets, ScreenAnalytics | ✅ |

### Persistencia

- Preferencia de idioma en `localStorage` bajo clave `quark.lang`
- Sincronización cross-component vía `CustomEvent('quark-settings-changed')`
- Cambio de idioma desde Settings > Language (pills EN/ES)
