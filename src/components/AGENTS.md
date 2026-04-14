# SHARED COMPONENTS

## OVERVIEW
`src/components` holds cross-route UI pieces and low-level reusable widgets, not feature-owned page components.

## WHERE TO LOOK
- global chrome: `nav-card.tsx`, `music-card.tsx`, `scroll-top-button.tsx`
- reusable dialogs/inputs: `dialog-modal.tsx`, `select.tsx`, `color-picker*.tsx`
- blog rendering helpers: `blog-preview.tsx`, `blog-sidebar.tsx`, `blog-toc.tsx`, `markdown-image.tsx`, `code-block.tsx`
- specialized visual effect: `liquid-grass/`

## CONVENTIONS
- Shared means used by multiple routes or part of site-wide shell behavior.
- Keep component APIs narrow; route-specific data shaping should stay outside this folder.
- Motion and visual polish are normal here, but ownership matters more than reuse-by-accident.

## ANTI-PATTERNS
- Do not move one-route components here just because they are large.
- Do not let this folder become a dumping ground for route business logic or GitHub write flows.
- Do not introduce a barrel file unless multiple callers truly need one.
