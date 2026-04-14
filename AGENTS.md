# PROJECT KNOWLEDGE BASE

Generated: 2026-04-14 Asia/Shanghai
Commit: 601818e
Branch: main
Mode: update

## OVERVIEW
Personal blog/CMS on Next.js 16 App Router with a config-driven home page, GitHub App backed content writes, and optional Cloudflare/OpenNext deployment.

## STRUCTURE
```text
./
|- src/app/         App Router routes plus feature-local stores/services
|- src/components/  Shared UI used across routes
|- src/lib/         GitHub, auth, markdown, file, and content helpers
|- src/config/      JSON source of truth for site theme and home layout
|- src/svgs/        SVG sources plus generated `index.ts`
|- public/blogs/    Blog content store: indexes, per-post config, markdown, assets
|- src/layout/      Global shell, backgrounds, head helpers
|- public/images/   Stable media paths used by the in-app editor
```

## WHERE TO LOOK
- `src/app/AGENTS.md`: route-level conventions
- `src/app/(home)/AGENTS.md`: home cards, config dialog, home stores/services
- `src/app/write/AGENTS.md`: editor, preview, publish/delete flow
- `src/components/AGENTS.md`: shared UI boundary
- `src/lib/AGENTS.md`: shared helpers and GitHub/auth primitives
- `src/config/AGENTS.md`: JSON schema and source-of-truth rules
- `src/svgs/AGENTS.md`: generated SVG registry workflow
- `public/blogs/AGENTS.md`: blog content schema and indexing rules

## CONVENTIONS
- Prettier is the enforced formatter: tabs, single quotes, no semicolons, 160-char width, Tailwind class sorting.
- `@/*` maps to `src/*`; prefer alias imports over long relative chains.
- Feature-first structure is intentional: route folders may own local `components/`, `services/`, `stores/`, and `hooks/`.
- The home route is config-driven through `src/config/*.json` and zustand stores.
- Cloudflare support is normal maintenance, not a side path: `pnpm build:cf`, `pnpm preview`, `pnpm deploy`.

## CODE MAP
- `src/app/layout.tsx`: App Router root and metadata bootstrap.
- `src/layout/index.tsx`: global shell with backgrounds, nav card, toaster, music card.
- `src/app/(home)/page.tsx`: draggable card-based landing page.
- `src/app/(home)/stores/config-store.ts`: imports `site-content.json` and `card-styles.json`.
- `src/app/write/stores/write-store.ts`: editor form/image state and edit hydration.
- `src/app/write/services/push-blog.ts`: publishes markdown, config, assets, and updates `public/blogs/index.json`.
- `src/hooks/use-auth.ts`: auth state and PEM cache bridge.
- `src/lib/github-client.ts`: GitHub App and git/content API helpers.
- `src/lib/blog-index.ts`: deterministic blog index rebuild helpers.
- `src/svgs/index.ts`: generated icon registry from `scripts/gen-svgs-index.js`.

## ANTI-PATTERNS
- Do not store secrets in `src/config/site-content.json`.
- Do not upload GitHub App private keys or Wrangler tokens into the repo.
- Do not hand-edit generated files such as `src/svgs/index.ts`.
- Do not treat `public/blogs/` like random assets; loaders and sitemap generation depend on its schema.
- Do not move route-specific UI into `src/components/` unless it is reused across routes.

## COMMANDS
```bash
pnpm dev
pnpm svg
pnpm build
pnpm start
pnpm build:cf
pnpm preview
pnpm deploy
pnpm cf-typegen
```

## NOTES
- `next.config.ts` sets `reactStrictMode: false` and `typescript.ignoreBuildErrors: true`; still verify changes locally.
- `next-sitemap.config.js` fetches `public/blogs/index.json` from GitHub Raw, so blog index integrity matters outside blog pages.
- `public/images/` paths should stay stable because the in-app editor references them directly.
