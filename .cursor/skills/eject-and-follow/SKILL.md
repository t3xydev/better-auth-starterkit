---
name: eject-and-follow
description: >-
  Ejects a fork onto product branches while keeping kit-tracking branches for
  upstream sync and selective merges. Use when ejecting from the starter kit,
  following upstream, syncing kit updates, cherry-picking starter changes, or
  setting up origin/upstream remotes and branch layout.
---

# Eject and follow upstream

Fork stays syncable: **product work lives on ejected branches**; **kit updates land on tracking branches**, then you pull only what you want.

## Branch model

| Branch | Role |
|--------|------|
| `kit/main` | Tracks upstream starter (clean, rarely edited) |
| `app/main` | Ejected product line (default day-to-day work) |
| `app/sync/<topic>` | Optional short-lived branch to bring a kit change into `app/main` |

Do not invent more permanent branches unless the user asks. Local `main` may still exist; after eject, prefer working on `app/main`.

## Remotes

```bash
# origin = this fork (already set)
# upstream = starter kit (add once)
git remote add upstream https://github.com/t3xydev/better-auth-starterkit.git
git fetch upstream
```

If the fork *is* the starter repo, skip `upstream` and treat `origin/main` as the kit source while product work stays on `app/*`.

## Eject (once)

Creates the product branch and freezes a kit-tracking branch at the same commit.

```bash
git fetch upstream   # if configured
git checkout -B kit/main upstream/main   # or origin/main when no upstream remote
git checkout -B app/main kit/main
git push -u origin kit/main app/main
```

Then, **on `app/main` only** (never on `kit/main`):

1. Delete the starterkit identity rule so product agents stop treating the fork as the kit:

   ```bash
   git rm .cursor/rules/project-identity.mdc
   git commit -m "$(cat <<'EOF'
   chore: drop starterkit project-identity rule after eject

   EOF
   )"
   ```

2. Set the default working branch to **`app/main`**.
3. Tell the user: kit syncs happen on **`kit/main`**; features land on **`app/main`**.
4. Do **not** rewrite `kit/main` with product commits.

If `.cursor/rules/project-identity.mdc` reappears when merging kit → app, prefer **app** (keep it deleted) unless the user wants the kit rule back.

Optional: point GitHub default branch to `app/main`.

## Follow upstream

Refresh the kit branch, then selectively bring changes into the app.

```bash
git fetch upstream
git checkout kit/main
git merge --ff-only upstream/main   # prefer ff-only; if it fails, reset --hard upstream/main only with user OK
git push origin kit/main
```

### Bring a change into the app

**Small / known commits** — cherry-pick onto a sync branch:

```bash
git checkout app/main
git checkout -b app/sync/<short-topic>
git cherry-pick <sha>…              # from kit/main
# resolve conflicts, keep app customizations
git checkout app/main
git merge --no-ff app/sync/<short-topic>
git branch -d app/sync/<short-topic>
```

**Broader kit update** — merge `kit/main` into a sync branch, not straight onto `app/main` until reviewed:

```bash
git checkout -b app/sync/kit-$(date +%Y%m%d) app/main
git merge kit/main
# resolve; prefer keeping files under src/modules/ and app overrides
git checkout app/main
git merge --no-ff app/sync/kit-…
```

Never force-push `kit/main` or `app/main` unless the user explicitly asks.

## Conflict triage

When merging kit → app:

1. Prefer **app** for files under `src/modules/` and clear product overrides.
2. Prefer **kit** for starter core you have not customized.
3. For shared composition files (`src/lib/auth.ts`, layouts, deploy config): keep **thin wiring**; move custom logic out (see skill `modular-dev`).
4. Prefer **app** for `.cursor/rules/project-identity.mdc` — keep it deleted after eject.
5. Re-run `pnpm deploy:sync` after kit changes touch `deploy/config.ts`.

## What “ejected” means here

Eject is **branch separation** plus dropping starterkit-only agent identity on the product branch. You keep following upstream via `kit/main`. Full hard-fork (drop remotes / never sync) only if the user asks explicitly.

On eject, remove `.cursor/rules/project-identity.mdc` from **`app/main`**. Leave it on **`kit/main`** so upstream stays intact.

## Checklist

```
Eject / follow:
- [ ] upstream remote present (or origin is the kit)
- [ ] kit/main tracks starter
- [ ] app/main is the product branch
- [ ] .cursor/rules/project-identity.mdc removed on app/main
- [ ] product commits are not on kit/main
- [ ] sync uses app/sync/* then merge to app/main
- [ ] kit→app conflicts: keep project-identity.mdc deleted on app
- [ ] no force-push unless user requested
```

## Related

- Customization with fewer conflicts → skill `modular-dev`
- Deploy file edits → skill `deploy-targets`
