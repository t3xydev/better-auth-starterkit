"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cancelInvite, type InviteRow } from "@/lib/actions/admin-invites"

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "pending":
            return "default"
        case "used":
            return "secondary"
        case "rejected":
        case "canceled":
        case "expired":
            return "destructive"
        default:
            return "outline"
    }
}

export function InviteTable({ invites }: { invites: InviteRow[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function handleCancel(token: string) {
        startTransition(async () => {
            try {
                const result = await cancelInvite(token)
                if (!result.status) {
                    toast.error(result.message || "Failed to cancel invite")
                    return
                }
                toast.success("Invite canceled")
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to cancel invite")
            }
        })
    }

    if (invites.length === 0) {
        return (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No invites yet. Create one to get started.
            </p>
        )
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="w-12" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invites.map((invite) => {
                        const email =
                            invite.email ||
                            invite.emails?.join(", ") ||
                            "Public"
                        return (
                            <TableRow key={invite.id}>
                                <TableCell className="font-medium">{email}</TableCell>
                                <TableCell>{invite.role}</TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant(invite.status)}>
                                        {invite.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(invite.expiresAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {invite.status === "pending" ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isPending}
                                                >
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleCancel(invite.token)}
                                                >
                                                    Cancel
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
