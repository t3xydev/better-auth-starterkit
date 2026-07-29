import {
    sendEmail as sendInfraEmail,
    type EmailTemplateId,
    type EmailTemplateVariables,
} from "@better-auth/infra"
import nodemailer from "nodemailer"

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM
const APP_NAME = process.env.APPLICATION_NAME || "Better Auth StarterKit"

export const smtpEnabled = !!(SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_FROM)
const infraEnabled = !!process.env.BETTER_AUTH_API_KEY

const transporter = smtpEnabled
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
    : null

if (smtpEnabled) {
    console.log("[Email] SMTP enabled:", SMTP_HOST, "port", SMTP_PORT)
} else if (infraEnabled) {
    console.log("[Email] Better Auth Infra email enabled (no SMTP)")
} else {
    console.log("[Email] SMTP not configured – emails will be logged to console")
}

type SendOpts<T extends EmailTemplateId> = {
    template: T
    to: string
    subject: string
    text: string
    variables: EmailTemplateVariables<T>
    html?: string
}

/** Prefer SMTP → Better Auth Infra → console log. */
export async function sendEmail<T extends EmailTemplateId>(opts: SendOpts<T>) {
    if (transporter) {
        try {
            const info = await transporter.sendMail({
                from: SMTP_FROM,
                to: opts.to,
                subject: opts.subject,
                text: opts.text,
                html: opts.html,
            })
            console.log(`[Email] Sent via SMTP to ${opts.to} (messageId: ${info.messageId})`)
            return
        } catch (err) {
            console.error(`[Email] SMTP failed for ${opts.to}:`, err)
            // Fall through to Infra / console
        }
    }

    if (infraEnabled) {
        try {
            const result = await sendInfraEmail({
                template: opts.template,
                to: opts.to,
                subject: opts.subject,
                variables: {
                    appName: APP_NAME,
                    ...opts.variables,
                },
            })
            if (result.success) {
                console.log(`[Email] Sent via Infra to ${opts.to} (messageId: ${result.messageId})`)
                return
            }
            console.error(`[Email] Infra failed for ${opts.to}:`, result.error)
        } catch (err) {
            console.error(`[Email] Infra failed for ${opts.to}:`, err)
        }
    }

    console.log(`[Email] To: ${opts.to} | Subject: ${opts.subject}`)
    console.log(`[Email] ${opts.text}`)
}
