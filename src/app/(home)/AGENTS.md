# HOME STACK

## OVERVIEW
`src/app/(home)` drives the draggable landing page, config dialog, card visibility/layout rules, and home-only publishing helpers.

## WHERE TO LOOK
- `page.tsx`: route entry and card composition
- `stores/config-store.ts`: runtime config state from JSON imports
- `stores/layout-edit-store.ts`: layout editing state
- `config-dialog/`: editable home settings UI
- `services/push-site-content.ts`: remote config writes
- card files: home-only card implementations

## CONVENTIONS
- `site-content.json` and `card-styles.json` are the source of truth; the zustand store mirrors them for runtime edits.
- Card components are intentionally granular and position-driven; avoid collapsing them into a generic section system.
- Desktop/mobile behavior differs on purpose through `useSize()` and config flags.
- Add new editable home fields through the config dialog/store flow, not ad hoc local state.

## ANTI-PATTERNS
- Do not hand-edit layout offsets in random components; go through store/config flow.
- Do not add cross-route UI here; shared shells belong in `src/components` or `src/layout`.
- Do not change config JSON shape without updating store typing and dialog/editor surfaces together.
