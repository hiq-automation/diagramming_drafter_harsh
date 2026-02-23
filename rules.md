# 📜 HumanizeIQ AI Development Rules

This document outlines the strict boundaries and guidelines for AI-driven modifications to this application. These rules ensure that the **"Wiring"** (Auth, API Proxies, RBAC) and **"Branding"** (Standard Layout) remain functional and consistent across all Aura Craft Studio projects.

## 🚫 1. Immutable "Wiring" (DO NOT MODIFY)
The following files and logic sections are core infrastructure. Modification may break connectivity with the HumanizeIQ backend or Google AI Studio.

- **`services/apiUtils.ts`**: Logic for switching between Studio and Deployed modes.
- **`services/geminiService.ts`**: The proxy-aware AI client initialization.
- **`services/apiService.ts`**: R2 storage integration methods.
- **`metadata.json`**: The application's DNA.
- **`local_cookie.json`**: Essential for authentication within Google AI Studio.

## 🏗️ 2. Architecture: Container/View & SRP
To maintain scalability and the Single Responsibility Principle, follow these patterns:

- **Logic vs. Display Separation**: Business logic, data fetching, and state orchestration must live in **Containers** (`*Container.tsx`) or **Hooks** (`use*.ts`). UI layout and styling must live in **Views** (`*View.tsx` or `*Layout.tsx`).
- **Max File Length**: No code file should exceed **200 lines**. If a file grows beyond this, it MUST be decomposed into smaller, more specific modules, sub-components, or custom hooks.
- **Modular Features**: New capabilities should be grouped under `features/[feature-name]/` with their own logic and display files.

## ✅ 3. Permitted Modification Areas
- **`features/`**: Create domain-specific modules.
- **`components/`**: Create shared UI atoms or molecules.
- **`types.ts`**: Add new interfaces specific to the application's domain.
- **`hooks/`**: Add custom React hooks for local state or specific data fetching.

## 🎨 4. Aesthetic & Theme Standards
- **Tailwind Strategy**: Always use Tailwind CSS classes. Avoid inline styles.
- **Dark Mode**: Every component **must** include `dark:` variants.
- **Responsiveness**: Ensure layouts are mobile-friendly using `sm:`, `md:`, and `lg:` prefixes.

## 🤖 5. Integration Best Practices
- **Data Fetching**: Use `getUrlWithStudioAuth` and `getFetchOptions` from `apiUtils.ts`.
- **AI Prompts**: Use `getSystemInstruction(key)` from `geminiService.ts`.
- **Error Handling**: Implement loading states and graceful fallbacks.