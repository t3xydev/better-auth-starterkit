"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deleteInvite, type InviteRow } from "@/lib/actions/admin-invites"

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
    const [deleteTarget, setDeleteTarget] = useState<InviteRow | null>(null)

    function handleDelete() {
        if (!deleteTarget) return

        startTransition(async () => {
            try {
                const result = await deleteInvite(deleteTarget.token)
                if (!result.status) {
                    toast.error(result.message || "Failed to delete invite")
                    return
                }
                toast.success("Invite deleted")
                setDeleteTarget(null)
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to delete invite")
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
        <>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="w-24" />
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
                                    <TableCell className="text-right">
                                        {invite.status === "pending" ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                disabled={isPending}
                                                onClick={() => setDeleteTarget(invite)}
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete invite</DialogTitle>
                        <DialogDescription>
                            Delete the invite for{" "}
                            <strong>
                                {deleteTarget?.email ||
                                    deleteTarget?.emails?.join(", ") ||
                                    "this public link"}
                            </strong>
                            ? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? "Deleting…" : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
