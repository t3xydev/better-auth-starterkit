---
name: keep-docs-updated
description: >-
  Keeps Fumadocs MDX in docs/framework in sync with product and code changes.
  Use when changing features, env vars, auth plugins, admin/OIDC behavior,
  deployment, invites, or client trust; when adding or renaming a docs page;
  or when the user asks to update documentation.
---

# Keep docs updated

## Source of truth

- **Canonical docs:** [`docs/framework/`](../../../docs/framework/) (Fumadocs MDX only).
- **In-app:** `/docs/framework` when `NEXT_PUBLIC_DOCS_ENABLED=true` (`/docs` redirects there).
- **Do not** revive root `docs/*.md` guides or a parallel `content/docs` tree. `docs/assets/` is for marketing assets (e.g. README banner) only.

## When to update

After any change that users or operators need to know:

| Change | Update |
|--------|--------|
| New/changed env var | `environment-variables.mdx` + `.env.example` |
| Feature / plugin / endpoint | `features.mdx` (and focused page if one exists) |
| Admin / OAuth clients | `admin-panel.mdx` |
| Trust tiers / DCR / scopes | `client-trust-model.mdx` |
| Invites / invite-only | `invitations.mdx` |
| Deploy targets / sync | `deployment.mdx` (+ deploy-targets skill) |
| Product framing / roadmap | `product.mdx` |
| Local setup steps | `getting-started.mdx` |
| New doc page | Add `.mdx` + entry in `meta.json` + link from `index.mdx` |

Skip doc edits for pure refactors, typo-only code, or internal-only churn with no user-facing behavior.

## MDX rules

1. **Frontmatter** (quote values that contain `:`):

   ```mdx
   ---
   title: "Page title"
   description: "One-line summary."
   ---
   ```

2. **Internal links** use the app path, not the file path:

   - Index: `/docs/framework`
   - Page: `/docs/framework/getting-started`

3. **Sidebar:** edit [`docs/framework/meta.json`](../../../docs/framework/meta.json) when adding, removing, or reordering pages (`---` = separator).

4. **Copy:** follow project identity — own open / federated / decentralized IdP; do **not** name third-party IdP brands or hostnames in docs.

5. **Code pointers:** prefer stable paths (`src/lib/auth.ts`) or GitHub blob links for deep file refs.

## Checklist (per change)

```
- [ ] Right page(s) under docs/framework updated
- [ ] .env.example updated if env vars changed
- [ ] meta.json / index.mdx updated if pages added/removed
- [ ] Links use /docs/framework/...
- [ ] No duplicate guide left outside docs/framework
```

## Related

- Env flag: `NEXT_PUBLIC_DOCS_ENABLED` (see `src/lib/docs.ts`)
- Fumadocs source: `source.config.ts` (`dir: "docs/framework"`), `src/lib/source.ts` (`baseUrl: "/docs/framework"`)
- Contributing: update `docs/framework/` when behavior or env vars change
