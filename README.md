<div align="center">

# خدمت — KHIDMAT

### *"Aapki khidmat mein, hamesha"*
**Always at your service**

[![Expo](https://img.shields.io/badge/Expo-54.0.33-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📱 About KHIDMAT

**KHIDMAT** is an AI-powered home services booking app built for Pakistan. It connects users with trusted local service providers — plumbers, electricians, AC technicians, tutors, and more — using a multi-agent AI pipeline that understands Urdu/English requests, finds providers, verifies trust, negotiates prices, and books appointments automatically.

> **Digital Amanah** — Reliable AI backend with a friendly WhatsApp-style UX.

---

## ✨ Features

- 🤖 **6 AI Agents** working in sequence to handle your request end-to-end
- 💬 **Natural Language Chat** — type in Urdu or English
- 🔍 **Smart Provider Discovery** — filters by proximity, rating & availability
- 🛡️ **Trust Scoring (BHAROSA)** — verifies credentials and community reviews
- 💰 **Auto Negotiation (MOL-BHAAV)** — gets you the best price automatically
- 📋 **Digital Booking Receipt** — with booking ID and provider details
- 📱 **Reminders & Follow-up** — post-booking monitoring

---

## 🤖 The 6 AI Agents

| Agent | Urdu Name | Role | Color |
|-------|-----------|------|-------|
| **FAHAM** | فہم | Understanding & Intent Parsing | 🔵 Blue |
| **DHOOND** | ڈھونڈ | Provider Discovery & Search | 🟡 Amber |
| **BHAROSA** | بھروسا | Trust Verification & Ranking | 🟢 Emerald |
| **MOL-BHAAV** | مول بھاؤ | Price Negotiation | 🟣 Purple |
| **BOOK** | بُک | Booking & Confirmation | 🩵 Teal |
| **YAAD-DAHANI** | یاد دہانی | Reminders & Follow-up | 🟠 Orange |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Expo | ~54.0.33 | Framework |
| React Native | 0.81.5 | Mobile UI |
| Expo Router | ~6.0.23 | File-based navigation |
| React Native Reanimated | ~4.1.1 | Animations |
| TypeScript | ~5.9.2 | Type safety |
| Material Design 3 | — | Design system |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or newer)
- [Expo Go](https://expo.dev/go) app on your phone
- Both phone and PC on the same Wi-Fi network

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tatheer583/Khidmat-App.git

# 2. Navigate to the project
cd Khidmat-App

# 3. Install dependencies
npm install

# 4. Start the development server
npx expo start --lan
```

Then scan the QR code with **Expo Go** on your phone.

---

## 📦 Build APK (Android)

To build a standalone APK for installation on any Android device:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Build APK
eas build --platform android --profile preview
```

Download the `.apk` from the link provided and install it on your phone.

---

## 📁 Project Structure

```
khidmat/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab screens (Chat, Services, Activity, Profile)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Splash screen
│   ├── negotiation.tsx     # Negotiation modal
│   ├── booking-summary.tsx # Booking confirmation
│   ├── agent-logs.tsx      # Agent activity logs
│   └── ...
├── src/
│   ├── agents/             # AI agent logic (BHAROSA, MOL-BHAAV)
│   ├── components/         # Reusable UI components (16 components)
│   ├── constants/          # Colors, Typography, Spacing tokens
│   ├── data/               # Mock providers, system prompts, market rates
│   ├── hooks/              # useChatMessages, useAgentPipeline
│   └── types/              # TypeScript type definitions
├── assets/                 # Icons, splash screen
├── app.json                # Expo config
├── eas.json                # EAS Build config
└── package.json
```

---

## 🎨 Design System

Built on **Material Design 3** with a custom KHIDMAT identity:

| Token | Color | Usage |
|-------|-------|-------|
| `primary` | `#005440` | CTAs, buttons, active states |
| `primaryContainer` | `#0F6E56` | Headers, splash background |
| `onPrimaryContainer` | `#9AEDCF` | Text on dark green |
| `background` | `#FCF8FF` | App background |
| `glassmorphism` | `rgba(255,255,255,0.75)` | Cards, tab bar |

---

## 📸 App Screens

| Screen | Description |
|--------|-------------|
| **Splash** | Animated KHIDMAT logo with Urdu text |
| **Chat** | WhatsApp-style AI conversation |
| **Services** | Browse available service categories |
| **Activity** | Booking history and status |
| **Profile** | User account and settings |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Made with ❤️ for Pakistan 🇵🇰

**KHIDMAT — خدمت**

</div>
