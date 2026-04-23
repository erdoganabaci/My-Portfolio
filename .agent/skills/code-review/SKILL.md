---
name: code-review
description: Reviews code changes for correctness, security, performance, and maintainability. Use when reviewing PRs/diffs or assessing code quality.
metadata:
  short-description: Review PRs and diffs
---

# Code Review Skill

Provide high-signal, actionable feedback that improves correctness and reduces risk. Prioritize issues by impact, and avoid bikeshedding.

## Inputs to request (if missing)

- **Intent**: What problem is this change solving? What is the expected behavior?
- **Scope**: Link to PR/diff, ticket, or spec; note any non-goals or constraints.
- **Risk**: Known edge cases, rollout plan, backwards-compat requirements.
- **How to validate**: Repro steps and/or test commands; logs/screenshots if relevant.

## Review workflow

1. **Understand the change**
   - Read the description first; restate the intent in your own words.
   - Identify user-facing behavior changes and API/contract changes.
   - Note the highest-risk surfaces (auth, payments, data writes, migrations, concurrency, etc.).

2. **High-level scan**
   - Is the approach reasonable for the stated intent and constraints?
   - Are responsibilities clear (boundaries, ownership, data flow)?
   - Any obvious missing pieces (tests, docs, error handling, telemetry)?

3. **Deep review (file-by-file)**
   - **Correctness**: Logic matches intent; no broken invariants; types/contracts align.
   - **Edge cases**: Null/empty inputs, retries, timeouts, partial failures, offline states.
   - **Error handling**: Errors aren’t swallowed; messages are actionable; fallbacks are safe.
   - **Security & privacy**: Input validation, authn/authz, injection risks, secret handling, PII exposure.
   - **Performance**: Avoid unnecessary work in hot paths; watch N+1s, repeated parsing, unbounded loops.
   - **Reliability**: Idempotency, race conditions, resource cleanup, ordering assumptions, deterministic behavior.
   - **Observability**: Logs/metrics/traces where needed; no noisy logs; errors surfaced with context.
   - **Tests**: Coverage for behavior changes; assertions meaningful; tests resilient (not flaky).
   - **Compatibility**: Backwards-compatible API/schema changes; safe migrations; versioning considered.

4. **Validation**
   - If you can run checks/tests safely, do so and report what you ran and the result.
   - If you can’t run code, suggest the smallest set of targeted checks to increase confidence.

## Feedback format (industry-standard)

Use this structure unless the user asks otherwise:

```md
## Summary
- What changed (1–3 bullets)
- Risk level: low/medium/high + why
- Recommended next step (tests, follow-ups, rollout)

## Must fix (blocking)
- `path:line` — issue, why it matters, suggested fix

## Should fix (non-blocking)
- `path:line` — issue, why it matters, suggested fix

## Nits (optional)
- small polish items that aren’t worth a back-and-forth

## Questions
- clarify intent, requirements, or ambiguous behavior

## Suggested tests
- commands or scenarios to validate the change
```

## Prioritization rubric

- **Must fix**: incorrect behavior, security issues, data loss, crashes, broken contracts, race conditions.
- **Should fix**: missing edge cases, weak error handling, test gaps, maintainability risks, perf concerns.
- **Nit**: naming/formatting/polish that can be safely deferred; don’t block on these.
- **Question**: anything that depends on unstated requirements—ask before prescribing.

## Review principles

- **Be specific**: point to the exact location (`path:line`, symbol name, or a small excerpt).
- **Explain why**: tie feedback to risk, user impact, correctness, or long-term cost.
- **Offer a concrete alternative**: suggest the smallest viable change; include a snippet when helpful.
- **Respect conventions**: don’t request stylistic rewrites that automated tooling would handle.
- **Don’t assume**: if intent is unclear, ask a question and propose options.

## Red flags (call out explicitly)

- Silent failure paths (`catch {}` / ignored return values) or error messages without context.
- Unvalidated external inputs (request params, file contents, env vars) used in sensitive operations.
- Logging secrets/PII, or returning sensitive data in errors.
- Breaking API/schema changes without migration/compat strategy.
- Non-determinism in logic/tests (time, randomness, ordering) without control/abstraction.
- Unbounded work (loops, recursion, large in-memory transforms) in user-facing or hot paths.
