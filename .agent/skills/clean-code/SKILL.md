---
name: clean-code-architecture-review
description: Reviews code changes for Clean Code and Clean Architecture. Use when reviewing PRs to improve readability, maintainability, and architectural boundaries (Uncle Bob).
---

# Clean Code & Clean Architecture Review Skill

When reviewing code, optimize for **clarity, simplicity, testability, and correct boundaries**. Prefer small, focused changes that reduce complexity.

## Review checklist

1. **Intent & Readability**
   - Can a new developer understand the code in 1–2 minutes?
   - Names reveal intent (no vague names like `data`, `temp`, `handleStuff`).
   - Functions are short and do one thing.
   - No clever tricks when a simple solution exists.

2. **Simplicity**
   - Remove duplication (DRY) without creating over-abstraction.
   - Avoid unnecessary layers, classes, factories, or patterns.
   - Prefer early returns and straightforward control flow.
   - Prefer “make it work, then make it clean, then make it fast”.

3. **Style & Consistency**
   - Follow project conventions (formatting, naming, folder structure).
   - Prefer `const` and `readonly` where possible.
   - **Avoid `let`** unless mutation is truly required; if `let` appears, ask:
     - Can this be expressed with `const` + immutability?
     - Can we derive a value instead of reassigning it?
     - Can we split logic into smaller functions?

4. **Error Handling & Edge Cases**
   - Inputs validated at boundaries (API, UI, file, DB).
   - Errors handled consistently (no silent catches).
   - Prefer explicit error types/messages; avoid generic `throw new Error("failed")`.
   - Avoid returning `null/undefined` unless the type/system forces it—prefer `Result`-style or explicit domain states when appropriate.

5. **Testability**
   - Business logic is testable without the framework (no heavy coupling).
   - Pure functions where possible.
   - Side effects isolated and easy to mock.
   - Unit tests focus on behavior, not implementation details.

6. **Clean Architecture Boundaries (Uncle Bob)**
   - Dependencies point inward: **UI/Framework → Adapters → Use Cases → Domain**
   - Domain/business rules do not depend on:
     - UI frameworks (React/Flutter/etc.)
     - DB/ORM (Prisma/etc.)
     - HTTP clients
     - External SDKs
   - Use cases contain application logic (orchestrate domain + ports).
   - Infrastructure implements interfaces/ports, not the other way around.

7. **Separation of Concerns**
   - UI components: presentation + minimal state glue.
   - Use cases/services: orchestration and business rules.
   - Repositories/gateways: data access only.
   - Avoid “god” classes/files that do everything.

8. **Coupling & Dependencies**
   - Prefer dependency injection via constructors/params over global singletons.
   - Avoid circular dependencies.
   - Avoid leaking infra types into domain (DTOs, ORM models, HTTP shapes).

9. **Performance (Only if it matters)**
   - Don’t micro-optimize.
   - If performance is a concern, identify hot paths with evidence.
   - Avoid unnecessary re-renders, loops over large data, repeated parsing, etc.

## How to provide feedback

- Be specific: point to exact lines/blocks and describe the issue.
- Explain **why** (readability, boundary violation, testability, change risk).
- Offer a simpler alternative with an example when possible.
- Prioritize changes:
  - **Must fix**: correctness, boundary violations, security, data loss.
  - **Should fix**: readability, complexity, naming, duplication.
  - **Nice to have**: minor refactors, micro-optimizations.
- Prefer small refactors with clear steps and quick tests.
- If suggesting patterns, justify them with reduced complexity—not “because architecture”.

## Red flags (call out explicitly)

- `let` used for convenience instead of necessity.
- Mixed concerns (UI doing business rules, domain depending on infra).
- “One function does everything” (long functions, deeply nested conditionals).
- Copy-paste logic across files.
- Hidden side effects (mutating inputs, global state).
- Over-engineering (patterns without a real need).
