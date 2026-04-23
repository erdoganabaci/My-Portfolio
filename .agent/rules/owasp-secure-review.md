---
trigger: always_on
---

---
description: OWASP secure coding review (findings + fixes + tests)
---

1. Ask for context: language/framework, entrypoints, auth model, data sensitivity.
2. Identify trust boundaries and all input sources.
3. Review using OWASP Secure Coding Practices categories:
   - input validation, output encoding, auth/passwords, sessions
   - access control, crypto, logging/error handling, data protection
   - comms security, config, database security, file management
4. Produce a findings list with:
   - severity (Critical/High/Med/Low), location, risk, recommendation
5. Propose minimal patches:
   - small diffs, safe defaults, no breaking changes unless required
6. Add/extend tests:
   - unit + integration tests for the fixed behavior
7. Provide a short “secure-by-default checklist” for future changes.
