<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Aura Craft Studio: Shared UI Framework

This repository provides a reusable UI skeleton with integrated Authentication, Theme management, and AI Connection services. It is designed to work seamlessly both in Google AI Studio (Studio Mode) and in standard deployed environments.

## 🌟 High-Level Overview

Aura Craft Studio is a modular foundation for building AI-powered applications. It abstracts away the complexities of:
- **Authentication & RBAC:** Seamless user identity management across different hosting modes.
- **AI Connectivity:** Pre-wired access to Google Gemini models via a secure proxy.
- **Theming:** A robust light/dark mode system powered by Tailwind CSS.
- **Cloud Storage:** Standardized operations for R2 storage (upload, download, list).
- **Architecture:** A strict Container/View pattern that ensures long-term scalability and code quality.

## 📖 Critical Documentation

### 🚀 [instructions.md](./instructions.md)
The essential "Getting Started" guide. It details the initial setup of `metadata.json` and provides the **Mandatory Prompt Template** required for AI-accelerated feature development.

### 📜 [rules.md](./rules.md)
The "Source of Truth" for development boundaries. It defines which parts of the system are immutable (the "Wiring") and establishes coding standards like the 200-line file limit and modular feature grouping.

---

## 💻 Run Locally

**Prerequisites:** Node.js

1. **Install dependencies:**
   `npm install`
2. **Set the API Key:**
   Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. **Run the app:**
   `npm run dev`

---

## 🛠️ Project Links

- **AI Studio App:** [https://ai.studio/apps/drive/1eaFbkjczgCmq_TXULG7_eSOgkyaGX1Yk](https://ai.studio/apps/drive/1eaFbkjczgCmq_TXULG7_eSOgkyaGX1Yk)
- **Organization:** HumanizeIQ
