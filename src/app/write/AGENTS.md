# WRITE FLOW

## OVERVIEW
`src/app/write` is the blog authoring workflow: editor state, preview state, image handling, publish/delete services, and edit-mode hydration.

## WHERE TO LOOK
- `page.tsx`, `[slug]/page.tsx`: create and edit routes
- `stores/write-store.ts`: main form/image/cover state
- `stores/preview-store.ts`: preview state
- `hooks/use-publish.ts`: publish/delete orchestration
- `services/push-blog.ts`, `services/delete-blog.ts`: remote mutations
- `components/`: editor, sidebar, actions, preview, sections

## CONVENTIONS
- Keep create/edit mode logic in the store and publish hook rather than scattering it through UI components.
- Publishing updates markdown, `config.json`, post assets, and `public/blogs/index.json` together.
- Local image placeholders use `local-image:<id>` and are rewritten during publish.
- Slug changes are intentionally blocked in edit mode.

## ANTI-PATTERNS
- Do not write directly to `public/blogs` from UI components.
- Do not bypass image dedupe/hash handling in the store.
- Do not update blog content without keeping index regeneration in sync.
