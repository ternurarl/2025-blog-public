# BLOG CONTENT STORE

## OVERVIEW
`public/blogs` is a content boundary, not a generic asset folder. It stores blog indexes plus per-post metadata, markdown, and post-local assets.

## WHERE TO LOOK
- `index.json`: global post list
- `categories.json`: category list
- `public/blogs/<slug>/`: per-post folder
- `public/blogs/<slug>/config.json`: post metadata
- `public/blogs/<slug>/index.md`: post markdown
- `src/app/write/services/push-blog.ts`, `src/lib/load-blog.ts`, `src/lib/blog-index.ts`, `next-sitemap.config.js`: main readers/writers

## CONVENTIONS
- Preserve the folder contract: one slug directory per post, with `config.json` and `index.md`.
- `index.json` is the canonical listing used by readers and sitemap generation.
- Publish flows may also add hashed image assets under the post directory.
- Dates, summary, cover, hidden flag, and category belong in post config/index metadata.

## ANTI-PATTERNS
- Do not treat this folder like throwaway static content; loaders and sitemap generation depend on its shape.
- Do not rename core files without updating code that reads them.
- Do not manually patch index ordering in ways that fight the publish/index rebuild flow.
