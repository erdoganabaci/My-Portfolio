---
trigger: always_on
---

# Security Non-Negotiables (OWASP-aligned)

- Never hardcode secrets (API keys, tokens, passwords). Use env vars / secret managers.
- Validate and sanitize all external inputs (HTTP, CLI, files, webhooks).
- Encode outputs correctly (HTML/JS/URL/SQL contexts).
- No `eval`, `exec`, dynamic code execution, or unsafe deserialization.
- Authentication & authorization must be explicit and tested.
- Use approved crypto libraries only; never invent crypto.
- Log security events safely (no secrets/PII in logs); fail securely.
- If unsure about threat model or trust boundary: ask before implementing.
