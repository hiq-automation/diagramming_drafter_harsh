
# 🚀 Getting Started with Aura Craft Studio

This template is a pre-wired, modular framework designed for AI-accelerated development. Follow these two steps to build your application.

## 1️⃣ Step 1: Manual Setup
Before using AI prompts, manually update `metadata.json` in the root directory. This tells the system who you are and what you are building.

```json
{
  "name": "Your App Name",
  "description": "Clear description of your app's purpose",
  "organization": "YourOrg",
  "project": "YourProject",
  "component": "YourApp"
}
```
*Note: The `organization`, `project`, and `component` fields are critical for the AI to fetch your specific system instructions and prompts from the CMS.*

## 2️⃣ Step 2: AI-Driven Development
From this point forward, use the **Mandatory Prompt Template** below for every change or feature request. This ensures the AI respects the modular architecture and safety rules.

### 📋 Mandatory Prompt Template
Copy and paste this into your prompt when asking for updates:

> "I want to [describe your request].
> 
> **MANDATORY CONSTRAINTS:**
> 1. **STRICT ADHERENCE TO rules.md**: Read and follow all rules in `rules.md` without exception.
> 2. **CONTAINER/VIEW PATTERN**: Separate logic into smart `*Container.tsx` files and UI into presentational `*View.tsx` files.
> 3. **200-LINE LIMIT**: No single file may exceed 200 lines of code. Decompose into smaller modules or custom hooks if necessary.
> 4. **WIRING PROTECTION**: Do not modify core infrastructure files (Auth, API Utils, Gemini Service).
> 5. **AESTHETICS**: Use Tailwind CSS with full dark mode support (`dark:` variants) and responsive prefixes.
> 6. **MODULARITY**: Group new features under `features/[feature-name]/`."

---

## 🛠️ Developer Reference (For the AI)
- **`useAuth()`**: Access user identity and RBAC permissions.
- **`useTheme()`**: Toggle between light and dark modes.
- **`generateResponse()`**: Call Gemini via the HumanizeIQ proxy without managing keys.
- **`apiService.ts`**: Standardized R2 cloud storage operations (Upload/Download/List).
- **`rules.md`**: The source of truth for all architectural constraints.
