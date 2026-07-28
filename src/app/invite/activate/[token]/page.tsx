import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { ActivateInviteClient } from "@/components/activate-invite-client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/auth"

export default async function ActivateInvitePage({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        redirect(`/auth/sign-in?redirectTo=${encodeURIComponent(`/invite/activate/${token}`)}`)
    }

    let inviteDetails: {
        role: string
        email?: string
        inviterName?: string
    } | null = null

    try {
        const result = await auth.api.getInvite({
            headers: await headers(),
            query: { token },
        })
        if (result?.status) {
            inviteDetails = {
                role: result.invitation.role,
                email: result.invitation.email,
                inviterName: result.inviter?.name,
            }
        }
    } catch {
        // Invalid/expired tokens are handled in the client on accept/reject
    }

    return (
        <main className="container flex grow flex-col items-center justify-center gap-4 self-center p-4 md:p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>You have been invited</CardTitle>
                    <CardDescription>
                        {inviteDetails
                            ? `Accepting grants the "${inviteDetails.role}" role${
                                  inviteDetails.inviterName
                                      ? ` from ${inviteDetails.inviterName}`
                                      : ""
                              }.`
                            : "Accepting this invite applies the role configured by the sender."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ActivateInviteClient token={token} />
                    <p className="text-xs text-muted-foreground">
                        Signed in as {session.user.email}. Not you?{" "}
                        <Link href="/auth/sign-out" className="underline">
                            Sign out
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    )
}
