# SVG WORKFLOW

## OVERVIEW
`src/svgs` holds source SVG icons and a generated `index.ts` registry used by the app.

## WHERE TO LOOK
- source icons: `*.svg`
- generated registry: `index.ts`
- generator: `scripts/gen-svgs-index.js`

## CONVENTIONS
- Add, rename, or remove source `.svg` files here.
- Regenerate `index.ts` with `pnpm svg` after source icon changes.
- Keep icon filenames stable and descriptive because the generated registry exposes file-based keys.

## ANTI-PATTERNS
- Do not hand-edit `src/svgs/index.ts`.
- Do not treat generated output as the source of truth.
- Do not bury non-SVG assets in this folder.
