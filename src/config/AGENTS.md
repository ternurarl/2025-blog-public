# CONFIG SCHEMA

## OVERVIEW
`src/config` contains JSON source-of-truth files for site metadata, theme colors, home layout behavior, and default card positioning.

## WHERE TO LOOK
- `site-content.json`: site metadata, theme, toggles
- `card-styles.json`: active home card positions and visibility
- `card-styles-default.json`: reset/default values
- `src/app/(home)/stores/config-store.ts`: primary runtime consumer

## CONVENTIONS
- Treat these files as schema-owned content, not casual constants.
- Keep keys stable because the home config store infers types directly from JSON imports.
- Add defaults and runtime/store support together when introducing new fields.

## ANTI-PATTERNS
- Do not store secrets, keys, or tokens here.
- Do not change JSON shape without updating store consumers and editing UI.
- Do not put route-specific transient state into config JSON.
