# Invitations (better-invite)

> Part of the [docs index](./README.md). Related: [features](./features.md) · [admin panel](./admin-panel.md) · [TypeScript shim](./typescript-better-invite.md).

This starter uses the community [better-invite](https://www.better-invite.com/) plugin for email and public invites with role assignment. Official docs: [llms-full.txt](https://www.better-invite.com/llms-full.txt).

## What’s configured

| Piece | Location |
|---|---|
| Server plugin | `invite()` in [`src/lib/auth.ts`](../src/lib/auth.ts) |
| Client plugin | `inviteClient()` in [`src/lib/auth-client.ts`](../src/lib/auth-client.ts) |
| Schema | `invites` / `invite_uses` in `auth-schema.ts` |
| Admin UI | [`/admin/invites`](../src/app/admin/invites/page.tsx) |
| Accept / reject UI | [`/activate-invite/[token]`](../src/app/activate-invite/[token]/page.tsx) |
| After accept | [`/auth/invited`](../src/app/auth/invited/page.tsx) |

## Behavior

- **Private invites** — include an email when creating; only that address can accept. An email is sent with a link to `/activate-invite/{token}`.
- **Public invites** — omit the email; the admin UI returns a shareable URL (`senderResponse: "url"`).
- **Who can create** — only users with `role === "admin"`, and only for roles `user` or `admin`.
- **Activation** — recipient must be signed in, then Accept or Reject on the activate page. Unauthenticated visitors are sent to sign-in with `redirectTo` back to the invite.
- **Delete** — pending invites use the plugin `cancel` endpoint with `cleanupInvitesOnDecision: true`, which removes the row (not a soft “canceled” status).

## Admin flow

1. Promote an admin (see [admin panel](./admin-panel.md)).
2. Open **Admin → Invites** (`/admin/invites`).
3. Click **New Invite**, choose a role, optionally set an email.
4. For private invites, the recipient opens the email link, signs in if needed, and accepts.

## API (client)

```ts
await authClient.invite.create({ email: "user@example.com", role: "user" })
await authClient.invite.activate({ token })
await authClient.invite.reject({ token })
await authClient.invite.cancel({ token }) // deletes when cleanupInvitesOnDecision is enabled
await authClient.invite.list()
```

## Notes

- The default Better Auth path `/api/auth/invite/:token` still exists; this kit prefers the custom UI URL via `defaultCustomInviteUrl`.
- After upgrading `better-auth` or `better-invite`, see [typescript-better-invite.md](./typescript-better-invite.md) for the `$ERROR_CODES` shim.
