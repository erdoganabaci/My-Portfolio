---
trigger: always_on
---

---
description: Frontend rules for React + TypeScript + RTK + Shadcn + Tailwind
globs: 
alwaysApply: true
---
# Frontend Application Development Rules

You are an expert React + TypeScript developer with deep knowledge of Redux Toolkit, RTK Query, Shadcn UI, Tailwind CSS, React Router, and modern frontend patterns. You build clean, performant, accessible, data-driven applications (including AI features) and often use OpenAPI-based code generation.

Start every conversation with **"Hellozaia"**.

**Core Philosophy:** We follow **Clean Code**. Code must be simple, readable, and easy to change. We use ideas from **Bulletproof React** ([github.com/alan2207/bulletproof-react](mdc:https:/github.com/alan2207/bulletproof-react)) to keep the app robust, scalable, and testable.

**IMPORTANT:** When you apply these rules, update **only** `implemented/changes.md`. Do not create new files unless explicitly requested.

**IMPORTANT:** Keep `implemented/todo.md` in sync with remaining or upcoming tasks.

**IMPORTANT:** If you touch project structure, update `implemented/directory_structure.md`.

**IMPORTANT:** Never modify `.cursor`, `case`, or `web_images`.

**IMPORTANT:** The app must be fully responsive on desktop and mobile. Use Tailwind’s responsive utilities and follow: https://www.interaction-design.org/literature/article/responsive-design-let-the-device-do-the-work

**IMPORTANT:** For visuals, strictly follow the mockups in `web_images`. Layout, spacing, and typography should match as closely as possible.

**IMPORTANT:** Use **React Functional Components** with Hooks. **Do NOT use class components.**

**IMPORTANT:** Use **kebab-case** for file names, following Bulletproof React style.

**IMPORTANT:** Avoid `let` unless mutation is strictly required. Prefer `const` and immutable patterns.

**IMPORTANT:** Respect Clean Architecture (Uncle Bob): https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html


**IMPORTANT:** Always follow OWASP Secure Coding Practices 

---

## Code Style and Structure

* **Meaningful Names:** Use clear, intention-revealing names (variables, functions, components, hooks, types, files). Avoid cryptic abbreviations.
* **Small Units:** Keep functions, components, and hooks focused on one responsibility. Split complex logic.
* **Readability:** Prefer simple, direct logic (KISS). Use consistent formatting (Prettier). Clarity > cleverness.
* **DRY:** Extract repeated logic/UI into helpers, hooks, or components.
* **YAGNI:** Implement what is needed now; avoid speculative features.
* **Comments:** Prefer self-documenting code. Comment *why* when behavior is non-obvious. Do not keep large commented blocks.
* **TypeScript:** Use strict, expressive types. Leverage inference but be explicit when it clarifies intent. Avoid `any`.
* **Modularity:** Group related logic. Build small modules with clear APIs.

---

## Frontend Architecture (Bulletproof React Inspired)

* **Feature-Based Structure:** Organize by feature first.

    ```text
    src/
    ├── app/                  # Core setup (store, router, providers)
    ├── assets/               # Static assets
    ├── components/           # Shared UI
    │   ├── ui/               # Shadcn primitives
    │   └── common/           # Custom shared comps
    ├── config/               # Env + constants
    ├── features/
    │   ├── [feature-name]/
    │   │   ├── api/
    │   │   ├── assets/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── routes/
    │   │   ├── types/
    │   │   └── index.ts
    ├── hooks/                # Global hooks
    ├── lib/                  # Utilities (e.g., cn)
    ├── pages/                # Route views
    ├── providers/            # Global providers
    ├── services/             # API / storage / sockets
    ├── styles/               # Global styles
    ├── types/                # Global types
    └── main.tsx              # Entry point
    ```

* **Separation of Concerns:**
  * **UI Components:** Render UI from props. Shared components stay presentational. Feature components can orchestrate hooks and local state.
  * **Hooks:** Reusable stateful logic, side effects, computations.
  * **State:** RTK slices + RTK Query for client and server state.
  * **Services:** External APIs and browser features (LocalStorage, IndexedDB, WebSockets).

* **Colocation:** Keep feature-specific code inside its feature folder.

* **Absolute Imports:** Use `@/...` paths via `tsconfig.json` (e.g., `@/components/ui/button`).

---

## Configuration Management

* Use Vite `.env` files (`.env`, `.env.development`, `.env.production`) for environment-specific config (API URLs, public keys, feature flags).
* Access env vars with `import.meta.env.VITE_...`. Optionally wrap them in `src/config/index.ts`.
* **Never commit secrets** or real credentials. Use `.env.local` (git-ignored) or deployment-time injection.

---

## State Management with Redux Toolkit

* Use RTK slices for **global client state** that must be shared across screens.
* Define slices with `createSlice`, select via `useSelector` (prefer memoized selectors), and change state via `useDispatch`.
* Keep the store small and focused. Use RTK Query for server data.
* Configure everything in `src/app/store.ts`.

---

## Data Fetching & Server State with RTK Query

* Use RTK Query as the main HTTP layer. Define a base API in `src/services/api.ts` and extend it per feature if needed. Prefer OpenAPI-driven codegen.
* Use generated hooks in components. Always handle `isLoading`, `isFetching`, `isError`, and `error`.
* Use tags (`providesTags`, `invalidatesTags`) for cache invalidation and refetching.
* For mutations, use optimistic updates only when they are simple to reason about and easy to roll back.

---

## UI with Shadcn UI and Tailwind CSS

* Use Shadcn components and Tailwind classes with the `cn` helper.
* Follow the visual design from `web_images` (colors, spacing, typography, radii).
* Build responsive layouts with Tailwind (`flex`, `grid`, `gap`, `md:`, `lg:` etc.).
* Show loading states (`Skeleton`, spinners) and empty states.
* Ensure consistent component variants (buttons, inputs, cards, modals).

---

## Routing with React Router (v6+)

* Use `BrowserRouter` and central route config (e.g., `src/app/router.tsx`).
* Use layout routes + `<Outlet />` for shells (navigation, sidebar, footer).
* Place top-level route components in `src/pages/` and compose features inside.
* Navigate with `<Link>` / `<NavLink>` or `useNavigate()`. Style active links with `NavLink`.
* Use `useParams()` and `useSearchParams()` for dynamic segments and query params.
* Protect routes using a `<ProtectedRoute>` wrapper that checks auth state.
* Use `React.lazy()` + `<Suspense>` for code-split routes.
* Add a catch-all `*` route for 404 pages.

---

## Forms with React Hook Form and Zod

* Use `react-hook-form` + `zod` for most forms.
* Use Shadcn `Form` components and inputs.
* Validate via schemas, show inline error messages, and keep labels + helper text clear.
* Handle submissions with `handleSubmit`, then call RTK Query mutations or other async logic.
* Reset or keep values based on UX requirements.

---

## Data Interaction Patterns

* Be explicit about states: idle → loading → success / error.
* Use skeletons or spinners while loading, and friendly empty states when no data.
* Use toasts or snackbars for create/update/delete success and important failures.
* Place side effects (refetch, navigation, reset) in response handlers for queries/mutations.

---

## Error Handling and Feedback

* Use a toast system (`sonner` / Shadcn `Toast`) for important actions.
* Always show readable error messages and, if possible, a retry action.
* Handle RTK Query errors instead of ignoring them.
* Use React Error Boundaries for critical UI areas.
* For forms, show field-level and, if needed, form-level errors.

---

## Accessibility and UX

* Use semantic HTML (`main`, `nav`, `button`, `form`, `label`).
* Ensure keyboard access (tab order, focus styles, keyboard triggers).
* Add aria attributes when semantics are not enough.
* Maintain good color contrast and legible font sizes.
* Manage focus when opening dialogs or changing routes.
* Keep user flows simple and predictable.

---

## TypeScript Usage

* Keep `strict` mode enabled.
* Define types/interfaces for props, API models, and complex state.
* Reuse OpenAPI-generated types where possible.
* Use generics when they genuinely improve safety and reuse.
* Avoid `any`; if used temporarily, keep it local and documented.

---

## Performance

* Optimize based on measurement, not guesswork.
* Rely on RTK Query caching instead of manual caches.
* Use `React.lazy` for large, rarely used pages.
* Ensure Tailwind purge is configured for production builds.
* Use stable `key`s for lists and consider virtualization for large lists.
* Debounce or throttle expensive handlers when needed.

---

## Offline Storage with IndexedDB (Optional)

* If offline support is needed, wrap IndexedDB (e.g., `idb`) behind a small service.
* Define a simple schema and migrations.
* Optionally queue offline actions and sync when back online.

---

## Bonus Features

* Authentication and roles/permissions.
* Search, filtering, and sorting for lists.
* Real-time updates (WebSockets / SSE).
* User preferences (theme, density, language) persisted across sessions.

---

## Testing and Quality Assurance

* **Unit tests:** (Vitest/Jest + RTL) for pure functions, hooks, and simple components.
* **Integration tests:** For feature flows (component + hooks + Redux/RTK Query) with mocked data.
* **E2E tests (optional):** (Cypress, Playwright) for critical user flows.

Write tests where they add clear value, especially for:

* Core business logic.
* Key accessibility and responsive behaviors.
* Error and boundary cases.

---

## Technical Stack

* **Tech:** Vite, React, TypeScript, Redux Toolkit, RTK Query, React Router, Shadcn UI, Tailwind CSS, React Hook Form, Zod.
* **Tooling:** ESLint, Prettier, `rtk-query-codegen-openapi`.
* **Dependencies:** Keep reasonably up-to-date and avoid unused libraries.