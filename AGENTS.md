# Agent instructions

These instructions apply to **any** coding agent working in this repository (Cursor, Claude Code, Codex, Copilot, Gemini, etc.). Prefer this file and `agents/` over tool-specific skill copies.

## Kit workflows

| Topic | Canonical doc |
|-------|----------------|
| Eject from starter / follow upstream / branch model | [`agents/eject-and-follow.md`](agents/eject-and-follow.md) |
| Customize with fewer merge conflicts | [`agents/modular-dev.md`](agents/modular-dev.md) |
| Deploy target sync | [`agents/deploy-targets.md`](agents/deploy-targets.md) |

When the user asks to eject, sync the kit, or set up product vs starter branches, **read and follow** `agents/eject-and-follow.md` before acting.

## Branch model (summary)

| Branch | Role |
|--------|------|
| `main` | Product (default on remote when pushed) |
| `dev` | Starter line |
| `kit/main` | Local upstream mirror (**never push**) |
| `kit/sync/<topic>` | Short-lived kit → main merges (**never push**) |

On eject: ask if a remote is available; if yes, push `main` → set as default → push `dev`. Remove `.cursor/rules/project-identity.mdc` on `main` only.

## Product docs (humans)

End-user / operator docs live in `docs/framework/` (Fumadocs). Do not put agent workflows there.
