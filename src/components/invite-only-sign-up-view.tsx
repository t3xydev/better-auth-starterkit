"use client"

import { SignUpForm } from "@daveyplate/better-auth-ui"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function InviteOnlySignUpView({
    allowed,
    appName,
}: {
    /** True when an invite cookie is present, or no users exist yet (bootstrap). */
    allowed: boolean
    appName: string
}) {
    if (!allowed) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <p className="text-sm font-medium text-muted-foreground">{appName}</p>
                    <CardTitle>Invite required</CardTitle>
                    <CardDescription>
                        This server only allows registration through an invite
                        link. Open the link you were sent to continue.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/auth/sign-in">Back to sign in</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <p className="text-sm font-medium text-muted-foreground">{appName}</p>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Finish signing up to accept your invitation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignUpForm localization={{}} redirectTo="/auth/invited" />
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/sign-in" className="underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
