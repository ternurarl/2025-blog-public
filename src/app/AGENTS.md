# APP ROUTER GUIDE

## OVERVIEW
`src/app` owns route entries, route groups, and feature-local UI/state/services that are not shared enough for `src/components` or `src/lib`.

## WHERE TO LOOK
- `src/app/(home)`: landing stack and config dialog
- `src/app/write`: blog authoring workflow
- `src/app/blog`, `src/app/blog/[id]`: blog list/read flow
- `src/app/about`, `src/app/share`, `src/app/projects`, `src/app/pictures`, `src/app/bloggers`, `src/app/snippets`: editable content pages
- `src/app/rss.xml`, `src/app/svgs`, `src/app/clock`, `src/app/image-toolbox`: utility routes

## CONVENTIONS
- Keep route-specific UI, stores, hooks, and services inside the owning route folder.
- Prefer shared extraction only when code is reused across multiple routes.
- Most editable pages follow the same shape: `page.tsx` + local data file + `services/push-*.ts` and optional `components/`.
- Use `use client` only where interactivity is required; route files still rely on the shared shell in `src/layout`.

## ANTI-PATTERNS
- Do not create new shared abstractions in `src/app` when they belong in `src/components` or `src/lib`.
- Do not duplicate App Router guidance inside every medium route folder.
- Do not mix content schema rules into route docs; `src/config` and `public/blogs` own those boundaries.
