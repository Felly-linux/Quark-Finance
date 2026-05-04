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

### 🛡️ Security & Privacy
Centro de control de seguridad y privacidad. Toggle de telemetría, tratamiento de datos, sesiones activas, derechos del usuario (exportar, borrar, revocar). Ver sección **Seguridad informática** abajo.

## 🔐 Seguridad informática

Quark Finance trata tus finanzas con la misma rigurosidad que un banco — sin la opacidad. La filosofía es simple: **tus datos son tuyos. Punto.**

### Cifrado

| Capa | Algoritmo | Detalles |
|------|-----------|----------|
| En reposo | **AES-256-GCM** | Nonce único por registro · autenticado |
| En tránsito | **TLS 1.3** | HSTS · cert pinning · 0-RTT desactivado |
| Derivación de clave | **Argon2id** | 256 MB · 3 iteraciones · paralelismo 4 |
| Firma de auditoría | **Ed25519** | Logs hash-encadenados verificables |

### Filosofía Zero-Knowledge

Quark **no puede leer tu bóveda**. Las claves se derivan localmente desde tu contraseña maestra — el servidor solo almacena ciphertext opaco. Una orden judicial al servidor no compromete tus datos porque **el servidor literalmente no tiene la llave**.

- 🔑 **Custodia local** — la clave maestra nunca sale de tu dispositivo
- 🧮 **Inferencia IA opcional-local** — los prompts pueden quedarse en tu dispositivo (Ollama)
- 📜 **Sin backdoors** — ni de Quark, ni de gobiernos, ni de "uso legítimo"

### Autenticación

- **2FA TOTP** con 6 códigos de respaldo cifrados
- **FIDO2 / WebAuthn** — YubiKey, Solo, TouchID Passkey
- **Desbloqueo biométrico** (Face ID · Touch ID · Windows Hello)
- **Tiempo de sesión configurable** (15min – 4h)
- **Auto-bloqueo de bóveda** (1 / 5 / 15 / 60 min)
- **Lista de sesiones activas** con revocación individual y "cerrar sesión en otros sitios"

### Tratamiento de datos

| Política | Default | Descripción |
|----------|---------|-------------|
| Entrenamiento de IA | **OFF** | Quark **nunca** entrena modelos con tus transacciones |
| Telemetría anónima | **OFF** | Solo frecuencias de uso · cero PII |
| Reportes de fallos | **OFF** | Stack traces con estado redactado |
| Agregación anónima | **OFF** | k-anonimato ≥ 50 si se activa |
| Compartir con socios | **OFF** | Quark no vende ni cede datos a terceros de marketing |
| Proveedores externos | configurable | Plaid, CoinGecko: solo lectura, granularidad por cuenta |

### Derechos del usuario (GDPR · CCPA · LGPD)

- 📤 **Exportar todo** — JSON cifrado portable
- 👁️ **Registro de acceso** — quién vio qué (Art. 15 GDPR)
- 🔄 **Rotar todas las claves** — fuerza re-autenticación global
- 🗑️ **Eliminar cuenta** — triturado criptográfico con 30 días de gracia

### Red y residencia

- **Modo offline-first** — sync solo en Wi-Fi confiable, batería > 30%
- **Acceso solo VPN** — bloquea peticiones fuera de tu túnel
- **Lista blanca de IP** — ancla sesiones a redes conocidas
- **Residencia de datos** seleccionable (EU / US / LATAM)

### Auditoría

- **Log inviolable** hash-encadenado y firmado con Ed25519
- **Eventos de seguridad recientes** visibles en la pantalla de Seguridad
- **Auditorías externas** — SOC 2 Type II · ISO 27001 · pentest Q3 2026

### Cumplimiento

GDPR · CCPA · LGPD · SOC 2 Type II · ISO 27001 · PCI DSS Level 1 (donde aplica) · auditoría de criptografía abierta y reproducible.

> Configura todo desde **Sidebar → Security**. Cada toggle persiste en `localStorage` bajo la clave `quark.security` y emite un evento `quark-settings-changed` para sincronización en vivo.

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
├── interactive.jsx   # Force-directed graph, Settings, Security, Wallets, Analytics
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
