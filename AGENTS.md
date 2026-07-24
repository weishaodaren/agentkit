# AgentKit — Agent Notes

Compact guidance for OpenCode sessions in this repo.

## Repo shape

- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`) + Turbo.
- **Node**: `>=22`, **pnpm**: `>=10.30.2` (enforced via `packageManager` and `preinstall`).
- **Package manager**: only `pnpm` works; `npm install` is blocked.

| Package           | Role                       | Key scripts                                                 |
| ----------------- | -------------------------- | ----------------------------------------------------------- |
| `apps/server`     | Hono + Mastra HTTP runtime | `build: tsc`, `dev: tsx watch`                              |
| `apps/web`        | React 19 + Vite demo       | `dev: vite`, `build: vite build`, `typecheck: tsc --noEmit` |
| `apps/docs`       | VitePress docs             | `dev: vitepress dev`, `build: vitepress build`              |
| `packages/ui`     | Lit Web Components library | `build: tsc && vite build` (uses `unplugin-dts`)            |
| `packages/sdk`    | Stream SDK                 | `build: tsc && vite build` (uses `unplugin-dts`)            |
| `packages/shared` | Shared types               | `typecheck: tsc --noEmit`                                   |
| `packages/utils`  | Shared utilities           | `typecheck: tsc --noEmit`                                   |

## Developer commands

```bash
# Install / bootstrap
pnpm install

# Dev (Turbo TUI, all watch modes)
pnpm dev
pnpm dev:server   # http://localhost:4000
pnpm dev:web        # http://localhost:3000
pnpm dev:docs       # http://localhost:5173

# Build / verify
pnpm build            # all packages
pnpm build:packages   # only packages/*
pnpm typecheck        # all packages; depends on ^build via turbo
pnpm lint             # oxlint
pnpm lint:fix
pnpm format           # oxfmt write
pnpm format:check

# Test
pnpm test             # all unit tests via root vitest projects
pnpm test:watch
pnpm test:coverage
```

## Important constraints

### TypeScript version: always declare `typescript: "catalog:"`

- `unplugin-dts` (used by `packages/sdk` and `packages/ui`) has `typescript` as a peer dependency.
- Without an explicit `typescript` devDependency, pnpm may resolve the peer to `typescript@7.0.2` (pulled in by `vue` / `@mastra/deployer` / `typescript-paths`).
- **TypeScript 7+ breaks `unplugin-dts@1.0.3`** because the JS Compiler API is removed.
- **Rule**: any package that runs `tsc`, uses `unplugin-dts`, or has `typecheck`/`build` scripts must declare `typescript: "catalog:"` in its `devDependencies`.
- The workspace catalog pins `typescript: ^6.0.3`.

### Testing model

- Root `vitest.config.ts` uses Vitest 4 multi-project mode: `projects: ["apps/*", "packages/*"]`.
- Each package can have its own `vitest.config.ts` to override `include` / coverage.
- `packages/ui` tests run in a **browser** via Playwright (`@vitest/browser-playwright`). Running its tests requires Playwright browsers installed.
- `packages/utils` tests use `test/**/*.test.ts`.
- `packages/sdk` tests use `src/tests/**/*.{test,spec}.ts`.

### Server environment

- `apps/server` loads `.env` via `dotenv/config`.
- Required: `AGNES_BASE_URL` and `AGNES_API_KEY` for the LLM gateway.
- A checked-in `.env` and `.env.production` exist; do not commit real secrets.
- `apps/server` builds with `tsc` and outputs to `dist/`.

### Web dev proxy

- `apps/web` dev server proxies `/api` to `http://localhost:4000` (server).

### Pre-commit / quality gates

`lefthook.yml` runs in parallel on `pre-commit`:

- `oxlint` on staged `*.ts/*.tsx`
- `oxfmt` on staged `*.ts/*.tsx/*.json/*.css`
- `pnpm turbo run typecheck --affected`
- `codegraph sync --quiet` — requires the CodeGraph daemon to be running / auto-sync enabled.

Use `git commit --no-verify` sparingly; hooks enforce the real build contract.

## Workflow conventions

- **Lint**: oxlint (not ESLint). `pnpm lint` / `pnpm lint:fix`.
- **Format**: oxfmt (not Prettier). `pnpm format` / `pnpm format:check`.
- **Releases**: use Changesets. `pnpm changeset` → `pnpm version` → `pnpm release` (which builds then publishes).
- **Clean**: `pnpm clean` removes `node_modules` and `.turbo`; `pnpm clean:all` also removes per-package `node_modules`.

## When things break

- `unplugin-dts` build error about JS Compiler API → add `typescript: "catalog:"` to that package, then `pnpm install`.
- Typecheck failures after adding code → note that `turbo typecheck` depends on `^build`; run `pnpm build` first if needed.
- CodeGraph hook fails → run `codegraph sync` and retry, or check that `.codegraph/` daemon is healthy.

## Docs

- `README.md` has the full architecture and quick-start.
- Wiki: `apps/docs/wiki/项目概述.md` and adjacent files.
