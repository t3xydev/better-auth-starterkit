import { listInvites } from "@/lib/actions/admin-invites"
import { CreateInviteDialog } from "@/components/admin/create-invite-dialog"
import { InviteTable } from "@/components/admin/invite-table"

export default async function InvitesPage() {
    const invites = await listInvites()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Invites</h2>
                    <p className="text-sm text-muted-foreground">
                        {invites.length} {invites.length === 1 ? "invite" : "invites"}
                    </p>
                </div>
                <CreateInviteDialog />
            </div>
            <InviteTable invites={invites} />
        </div>
    )
}
