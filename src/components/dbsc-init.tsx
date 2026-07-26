"use client"

import { useEffect } from "react"
import {
    clearBoundKey,
    initBoundDbsc,
    wrapFetch,
    type BoundDbscOutcome,
} from "dbsc-toolkit/client"

const DBSC_PATHS = {
    statePath: "/api/auth/dbsc-bound/state",
    challengePath: "/api/auth/dbsc-bound/challenge",
    registrationPath: "/api/auth/dbsc-bound/registration",
    refreshPath: "/api/auth/dbsc-bound/refresh",
} as const

declare global {
    interface Window {
        initDbsc?: () => Promise<BoundDbscOutcome>
        boundFetch?: typeof fetch
        clearBoundKey?: typeof clearBoundKey
        __dbscOutcome?: Promise<BoundDbscOutcome>
    }
}

/**
 * Boots the DBSC polyfill SDK (IndexedDB key on Firefox/Safari/older Chromium;
 * co-registers alongside native TPM DBSC on Chrome 145+).
 *
 * Re-call `window.initDbsc()` after sign-in so binding observes the new session.
 * Call `window.clearBoundKey()` on sign-out.
 */
export function DbscInit() {
    useEffect(() => {
        window.initDbsc = () =>
            initBoundDbsc({ nativeProbeWindowMs: 8000, ...DBSC_PATHS })
        window.boundFetch = wrapFetch({ signBody: true })
        window.clearBoundKey = clearBoundKey

        window.__dbscOutcome = window.initDbsc()
        void window.__dbscOutcome
            .then((outcome) => console.log("[dbsc]", outcome))
            .catch((error) => console.error("[dbsc]", error))
    }, [])

    return null
}
