# Quark Finance

> **Tu asistente financiero cuántico con IA.**

Quark Finance no es otra app de presupuestos. Es un **copiloto de inteligencia artificial** que vive en tus finanzas, detectando patrones, fugas y oportunidades que ningún humano vería manualmente.

## ¿Qué es?

Una interfaz de finanzas personal de próxima generación — diseñada como un **centro de comando espacial** — donde cada dato cobra vida. Quark analiza tus transacciones, conecta cuentas bancarias, tarjetas, crypto e inversiones, y sintetiza todo en insights accionables en tiempo real.

## ✨ Funcionalidades

### 🧠 AI Copilot
Chat conversacional con tu analista financiero personal. Pregunta "¿podré pagar el alquiler?" y obtén respuestas con probabilidades, trazas de razonamiento y fuentes verificables.

### 🕸️ Quantum Insights
Grafo neural interactivo y force-directed que revela conexiones ocultas entre tu ingreso, gastos, estrés financiero y metas. Arrastra nodos, descubre correlaciones.

### 🎯 Risk Radar
Mapa de amenazas en vivo: cuentas flotantes, suscripciones zombie, fugas de dinero y riesgos de liquidez — todo priorizado y con soluciones listas.

### 👤 Digital Twin
Gemelo financiero que simula tu futuro con **Monte Carlo · 10,000 caminos**. ¿Qué pasa si te ascienden? ¿Si tomas un sabático? ¿Si compras casa? Simulalo.

### 🔮 Predictions
Forecast de patrimonio con conos de probabilidad (P10/P50/P90). Escenarios personalizados escritos en lenguaje natural que Quark simula al instante.

### 🚀 Missions
Gamificación financiera: misiones con XP, niveles y arquetipos. Desde "cancelar 3 suscripciones zombie" hasta "ahorrar $50k para tu casa". Progreso visible, recompensas reales.

### 📱 Multi-Provider AI Routing
6 proveedores de IA configurados con fallback inteligente. Haiku como primario, Sonnet para razonamiento complejo, Gemini para clasificación masiva, Ollama local para datos sensibles.

### 🌐 Bilingüe (EN / ES)
Soporte completo de español e inglés. Cambio de idioma en tiempo real con persistencia en `localStorage`. ~370+ traducciones cubriendo cada pantalla.

## 🎨 Diseño

- **Estética cósmica** con nebulosas de fondo, partículas flotantes y efecto glass
- **Orbital onboarding** — conecta tus cuentas como electrones orbitando el núcleo de Quark
- **Vista móvil** — preview en frame de iPhone con dashboard y chat
- **Spotlight (⌘K)** — navegación rápida por toda la app
- **Densidad ajustable** — modo Comfortable o Quantum Analyst

## 🏗️ Arquitectura

```
Finance/
├── auth.jsx          # Login, i18n (QLangProvider, TRANSLATIONS), MouseAmbient
├── app-shell.jsx     # Router, ScreenStub, MobilePreview, Spotlight, OnboardingOverlay
├── primitives.jsx    # QSidebar, QTopbar, QKpi, QSparkline, QLogo, QParticles
├── charts.jsx        # Gráficos especializados (donut, radar, etc.)
├── screens.jsx       # Dashboard, AI Copilot, Quantum Insights
├── screens2.jsx      # Risk Radar, Digital Twin, Predictions, Timeline
├── screens3.jsx      # Missions, AI Models, Onboarding, Mobile screens
├── interactive.jsx   # Force-directed graph, Settings, Wallets, Analytics
├── tweaks-panel.jsx  # Panel de ajustes en vivo (densidad, intensidad)
├── tokens.css        # Design tokens (colores, animaciones, glass)
└── index.html        # Entry point (React 18 + Babel standalone)
```

## 🚀 Cómo usar

1. Abre `index.html` en tu navegador
2. Inicia sesión o crea una cuenta (simulado)
3. Pasa el onboarding orbital
4. Explora las 12+ pantallas desde el sidebar

## 🛠️ Tech Stack

- **React 18** (CDN)
- **Babel Standalone** (JSX en browser)
- **SVG** para todos los gráficos y animaciones
- **Custom Events** para sincronización cross-component
- **localStorage** para persistencia de sesión, idioma y moneda
