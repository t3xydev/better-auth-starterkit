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
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createInvite } from "@/lib/actions/admin-invites"

const EXPIRE_PRESETS = [
    { value: "3600", label: "1 hour" },
    { value: "86400", label: "24 hours" },
    { value: "604800", label: "7 days" },
    { value: "2592000", label: "30 days" },
    { value: "5184000", label: "60 days" },
    { value: "7776000", label: "90 days" },
    // Plugin always stores expiresAt; ~100 years stands in for "never"
    { value: "3153600000", label: "Never" },
] as const

export function CreateInviteDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<"user" | "admin">("user")
    const [maxUses, setMaxUses] = useState("1")
    const [expiresIn, setExpiresIn] = useState("3600")
    const [shareInviterName, setShareInviterName] = useState(false)
    const [publicResult, setPublicResult] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const isPrivate = Boolean(email.trim())

    function reset() {
        setEmail("")
        setRole("user")
        setMaxUses("1")
        setExpiresIn("3600")
        setShareInviterName(false)
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
        const parsedMaxUses = Number.parseInt(maxUses, 10)
        if (!Number.isFinite(parsedMaxUses) || parsedMaxUses < 1) {
            toast.error("Max uses must be at least 1")
            return
        }

        const parsedExpiresIn = Number.parseInt(expiresIn, 10)
        if (!Number.isFinite(parsedExpiresIn) || parsedExpiresIn < 1) {
            toast.error("Choose a valid expiration")
            return
        }

        startTransition(async () => {
            try {
                const result = await createInvite({
                    email: email.trim() || undefined,
                    role,
                    maxUses: parsedMaxUses,
                    expiresIn: parsedExpiresIn,
                    shareInviterName: isPrivate ? shareInviterName : false,
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
                            ? "Copy this link to share. You can also reopen it later from the invites table."
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
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="invite-max-uses">Max uses</Label>
                                <Input
                                    id="invite-max-uses"
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={maxUses}
                                    onChange={(e) => setMaxUses(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Expires</Label>
                                <Select
                                    value={expiresIn}
                                    onValueChange={setExpiresIn}
                                    disabled={isPending}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EXPIRE_PRESETS.map((preset) => (
                                            <SelectItem key={preset.value} value={preset.value}>
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {isPrivate ? (
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="share-inviter-name">Show your name</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Welcome page says who sent the invite
                                    </p>
                                </div>
                                <Switch
                                    id="share-inviter-name"
                                    checked={shareInviterName}
                                    onCheckedChange={setShareInviterName}
                                    disabled={isPending}
                                />
                            </div>
                        ) : null}
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
