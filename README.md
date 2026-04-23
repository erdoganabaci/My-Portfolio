# Erdogan Portfolio

Portfolio site rebuilt on Vite, React, TypeScript, and Tailwind with a static GitHub snapshot and an interactive CV chat route.

## Development

```bash
npm install
npm run dev
```

## Environment

Create `.env` from `env.example` and set:

```bash
VITE_CHAT_API_URL="https://your-chat-endpoint"
```

`GITHUB_TOKEN` and `GITHUB_USERNAME` are only needed for the optional snapshot refresh:

```bash
npm run sync:github-profile
```

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
