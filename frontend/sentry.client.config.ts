import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://96272733799183ad03b98432bd376f80@o4511137791868928.ingest.us.sentry.io/4511140266704896',
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,
  integrations: [
    Sentry.replayIntegration(),
  ],
})
