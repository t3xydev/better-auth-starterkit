import { redirect } from "next/navigation"

/** @deprecated Prefer `/invite/activate/[token]` */
export default async function ActivateInviteRedirect({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    redirect(`/invite/activate/${token}`)
}
