const SENTRY_DSN = 'https://96272733799183ad03b98432bd376f80@o4511137791868928.ingest.us.sentry.io/4511140266704896'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({ dsn: SENTRY_DSN, tracesSampleRate: 0.1 })
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({ dsn: SENTRY_DSN, tracesSampleRate: 0.1 })
  }
}
