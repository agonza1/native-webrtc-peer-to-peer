# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

WebRTC peer-to-peer video calling app: a Node.js/Express + Socket.IO signaling server (TypeScript) serving a vanilla JS/HTML frontend. Single-process monolith — no database, no external services needed.

### Node version

Requires Node.js `>=8 <20` (per `package.json` `engines` field). Use **Node 18** via nvm (`nvm use 18`).

### Running the dev server

- **Command:** `npm run dev` (uses `ts-node-dev --transpile-only`)
- **Ports:** HTTP on **80**, HTTPS on **8443** (configured in `src/config.json`)
- Port 80 requires root/sudo: run with `sudo -E env "PATH=$PATH" npm run dev`
- Self-signed TLS certs are bundled in `cert/`

### Build

`npm run build` — compiles TypeScript via `tsc`. Note: may produce type errors from `engine.io` dependency (missing `@types/ws`). The dev server bypasses this with `--transpile-only`.

### Tests

`npm test` — configured to run `jest`, but no test files or jest dependency exist in the repo currently.

### Lint

No dedicated linter is configured. TypeScript strict mode (`tsconfig.json`) provides type checking during `npm run build`.

### Browser testing caveat

The client calls `navigator.mediaDevices.getUserMedia()` on load, which requires a camera. In headless/cloud environments this produces a `NotFoundError` — this is expected and does not affect the signaling server functionality.
