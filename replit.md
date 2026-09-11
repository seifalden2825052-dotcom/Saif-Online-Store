# Saif Online Store

Premium electronics storefront imported from the `seifalden2825052-dotcom/obsidian-deals` GitHub repository.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/saif-online-store/src/App.jsx` — storefront composition and entry surface
- `artifacts/saif-online-store/src/components/` — navigation, hero, product grid, cart, checkout, and product configuration
- `artifacts/saif-online-store/src/data/products.js` — current product catalog
- `artifacts/saif-online-store/src/store/` — browser-persisted cart, theme, and UI state
- `artifacts/saif-online-store/src/styles.css` — storefront theme tokens and global styles
- `lib/api-spec/openapi.yaml` — shared API contract for future server-backed flows

## Architecture decisions

- The imported storefront runs as a standalone React/Vite artifact so it can be previewed and published without requiring a backend.
- Cart and theme state remain local for the initial imported experience; order persistence is a planned follow-up.
- The artifact owns its Vite routing and base path through the managed workflow environment.

## Product

- Premium electronics browsing experience branded as AUREN.
- Animated hero, product catalog, category and price filtering, search overlay, product configuration, theme toggle, cart drawer, and checkout modal.
- Responsive layout with local cart persistence and polished motion interactions.

## User preferences

- The user wants this project to serve as a strong freelance portfolio piece.

## Gotchas

- Run the storefront through its managed workflow; the Vite config expects workflow-provided `PORT` and `BASE_PATH`.
- `react-resizable-panels` is pinned to the workspace-compatible v2 API; keep its imports aligned with `PanelGroup`, `Panel`, and `PanelResizeHandle`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
