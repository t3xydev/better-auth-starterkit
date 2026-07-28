"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createInvite } from "@/lib/actions/admin-invites"

export function CreateInviteDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<"user" | "admin">("user")
    const [publicResult, setPublicResult] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    function reset() {
        setEmail("")
        setRole("user")
        setPublicResult(null)
        setCopied(false)
    }

    function handleOpenChange(next: boolean) {
        if (!next) reset()
        setOpen(next)
    }

    async function copyResult(value: string) {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleCreate() {
        startTransition(async () => {
            try {
                const result = await createInvite({
                    email: email.trim() || undefined,
                    role,
                })

                if (!result.status) {
                    toast.error(result.message || "Failed to create invite")
                    return
                }

                if (email.trim()) {
                    toast.success("Invitation email sent")
                    handleOpenChange(false)
                    router.refresh()
                    return
                }

                // Public invite: message is the token or URL
                setPublicResult(result.message)
                toast.success("Public invite created")
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to create invite")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="size-4" />
                    New Invite
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {publicResult ? "Invite created" : "Create invite"}
                    </DialogTitle>
                    <DialogDescription>
                        {publicResult
                            ? "Copy this link or token to share. It will not be shown again here."
                            : "Leave email empty for a public invite URL. With an email, only that address can accept."}
                    </DialogDescription>
                </DialogHeader>

                {publicResult ? (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input readOnly value={publicResult} className="font-mono text-xs" />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => copyResult(publicResult)}
                            >
                                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                            </Button>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => handleOpenChange(false)}>Done</Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="invite-email">Email (optional)</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={role}
                                onValueChange={(value) => setRole(value as "user" | "admin")}
                                disabled={isPending}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">user</SelectItem>
                                    <SelectItem value="admin">admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} disabled={isPending}>
                                {isPending ? "Creating…" : "Create"}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
