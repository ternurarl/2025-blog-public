# SHARED LOGIC

## OVERVIEW
`src/lib` owns cross-route helpers for auth, GitHub API access, blog index maintenance, markdown rendering, file handling, and general utilities.

## WHERE TO LOOK
- `github-client.ts`: GitHub API primitives
- `auth.ts`: auth/token helpers
- `blog-index.ts`: blog index maintenance
- `load-blog.ts`: blog loading helpers
- `markdown-renderer.ts`: markdown pipeline
- `file-utils.ts`: file/image helpers

## CONVENTIONS
- Prefer pure helpers and explicit function exports.
- Keep route-specific orchestration out of `src/lib`; route services should compose these primitives.
- If a helper changes a persisted schema or remote path, audit callers in `src/app` and `public/blogs`.

## ANTI-PATTERNS
- Do not import route UI into `src/lib`.
- Do not duplicate GitHub request logic inside feature folders when a lib primitive already exists.
- Do not silently change blog index sorting or path conventions.
