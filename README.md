# Quark Finance

> **Your AI-powered quantum financial assistant.**

Quark Finance isn’t just another budgeting app. It’s an **AI co-pilot** that lives within your finances, detecting patterns, leaks, and opportunities that no human could spot manually.

## What is it?

A next-generation personal finance interface—designed like a **space command center**—where every piece of data comes to life. Quark analyzes your transactions, connects bank accounts, cards, crypto, and investments, and synthesizes everything into actionable insights in real time.

## ✨ Features

### 🧠 AI Copilot
Conversational chat with your personal financial analyst. Ask “Will I be able to pay the rent?” and get answers with probabilities, reasoning trails, and verifiable sources.

### 🕸️ Quantum Insights
An interactive, force-directed neural graph that reveals hidden connections between your income, expenses, financial stress, and goals. Drag nodes, discover correlations.

### 🎯 Risk Radar
Live threat map: floating accounts, zombie subscriptions, money leaks, and liquidity risks—all prioritized and with ready-made solutions.

### 👤 Digital Twin
A financial twin that simulates your future with **Monte Carlo · 10,000 paths**. What if you get promoted? What if you take a sabbatical? What if you buy a house? Simulate it.

### 🔮 Predictions
Wealth forecast with probability cones (P10/P50/P90). Custom scenarios written in natural language that Quark simulates instantly.

### 🚀 Missions
Financial gamification: missions with XP, levels, and archetypes. From “cancel 3 zombie subscriptions” to “save $50k for your house.” Visible progress, real rewards.

### 📱 Multi-Provider AI Routing
6 AI providers configured with smart fallback. Haiku as primary, Sonnet for complex reasoning, Gemini for massive classification, local Ollama for sensitive data.

### 🌐 Bilingual (EN / ES)
Full support for Spanish and English. Real-time language switching with persistence in `localStorage`. ~370+ translations covering every screen.

### 🛡️ Security & Privacy
Security and privacy control center. Toggles for telemetry, data processing, active sessions, user rights (export, delete, revoke). See the **Cybersecurity** section below.

## 🔐 Cybersecurity

Quark Finance treats your finances with the same rigor as a bank—without the opacity. The philosophy is simple: **your data is yours. Period.**

### Encryption

| Layer | Algorithm | Details |
|------|-----------|----------|
| At rest | **AES-256-GCM** | Unique nonce per record · authenticated |
| In transit | **TLS 1.3** | HSTS · certificate pinning · 0-RTT disabled |
| Key derivation | **Argon2id** | 256 MB · 3 iterations · 4-way parallelism |
| Audit signature | **Ed25519** | Verifiable chained hash logs |

### Zero-Knowledge Philosophy

Quark **cannot read your vault**. Keys are derived locally from your master password—the server only stores opaque ciphertext. A court order against the server does not compromise your data because **the server literally does not have the key**.

- 🔑 **Local custody** — the master key never leaves your device
- 🧮 **Optional local AI inference** — prompts can stay on your device (Ollama)
- 📜 **No backdoors** — not from Quark, not from governments, not for “legitimate use”

### Authentication

- **TOTP 2FA** with 6 encrypted backup codes
- **FIDO2 / WebAuthn** — YubiKey, Solo, TouchID Passkey
- **Biometric unlock** (Face ID · Touch ID · Windows Hello)
- **Configurable session time** (15 min – 4 h)
- **Auto-lock vault** (1 / 5 / 15 / 60 min)
- **List of active sessions** with individual revocation and “log out of other sites”

### Data Processing

| Policy | Default | Description |
|----------|---------|-------------|
| AI Training | **OFF** | Quark **never** trains models using your transactions |
| Anonymous Telemetry | **OFF** | Usage frequencies only · zero PII |
| Crash Reports | **OFF** | Stack traces with redacted status |
| Anonymous Aggregation | **OFF** | k-anonymity ≥ 50 if enabled |
| Share with partners | **OFF** | Quark does not sell or transfer data to third-party marketers |
| Third-party providers | configurable | Plaid, CoinGecko: read-only, granularity by account |

### User rights (GDPR · CCPA · LGPD)

- 📤 **Export all** — portable encrypted JSON
- 👁️ **Access log** — who viewed what (Art. 15 GDPR)
- 🔄 **Rotate all keys** — forces global re-authentication
- 🗑️ **Delete account** — cryptographic shredding with 30-day grace period

### Network and residency

- **Offline-first mode** — sync only on trusted Wi-Fi, battery > 30%
- **VPN-only access** — blocks requests outside your tunnel
- **IP whitelist** — anchors sessions to known networks
- Selectable **data residency** (EU / US / LATAM)

### Auditing

- **Tamper-proof log** hashed and signed with Ed25519
- **Recent security events** visible on the Security screen
- **External audits** — SOC 2 Type II · ISO 27001 · pentest Q3 2026

### Compliance

GDPR · CCPA · LGPD · SOC 2 Type II · ISO 27001 · PCI DSS Level 1 (where applicable) · open and reproducible cryptography audit.

> Configure everything from **Sidebar → Security**. Each toggle persists in `localStorage` under the key `quark.security` and emits a `quark-settings-changed` event for live synchronization.

## 🎨 Design

- **Cosmic aesthetics** with nebulae in the background, floating particles, and a glass effect
- **Orbital onboarding** — connect your accounts like electrons orbiting the Quark nucleus
- **Mobile view** — preview in an iPhone frame with dashboard and chat
- **Spotlight (⌘K)** — quick navigation throughout the app
- **Adjustable density** — Comfortable or Quantum Analyst mode

## 🏗️ Architecture

```
Finance/
├── supabase-config.example.js  # Template — copy to supabase-config.js (local, gitignored)
├── schema.sql                  # Reference SQL schema (Supabase / Postgres)
├── auth.jsx                    # Login, i18n (QLangProvider, TRANSLATIONS), MouseAmbient
├── app-shell.jsx               # Router, ScreenStub, MobilePreview, Spotlight, OnboardingOverlay
├── primitives.jsx              # QSidebar, QTopbar, QKpi, QSparkline, QLogo, QParticles
├── charts.jsx                  # Specialized charts (donut, radar, etc.)
├── screens.jsx                 # Dashboard, AI Copilot, Quantum Insights
├── screens2.jsx                # Risk Radar, Digital Twin, Predictions, Timeline
├── screens3.jsx                # Missions, AI Models, Onboarding, Mobile screens
├── interactive.jsx             # Force-directed graph, Settings, Security, Wallets, Analytics
├── tweaks-panel.jsx            # Live settings panel (density, intensity)
├── tokens.css                  # Design tokens (colors, animations, glass)
└── index.html                  # Entry point (React 18 + Babel standalone + Supabase)
```

## 🚀 How to use

1. **Supabase (required):** copy `supabase-config.example.js` to `supabase-config.js` and set your project URL and *anon* key from the Supabase dashboard. That file is not committed to git.
2. Open `index.html` in your browser (or serve the folder with any static file server).
3. Log in or create an account (simulated).
4. Complete the orbital onboarding.
5. Explore the 12+ screens from the sidebar.

## 🛠️ Tech Stack

- **React 18** (CDN)
- **Babel Standalone** (JSX in browser)
- **Supabase** (`@supabase/supabase-js` via CDN; URL and anon key in local `supabase-config.js`)
- **SVG** for all graphics and animations
- **Custom Events** for cross-component synchronization
- **localStorage** for session, language, and currency persistence
