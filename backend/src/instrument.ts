import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: 'https://e698d8c2bbcb2320e1c6283d2c9d9f15@o4511137791868928.ingest.us.sentry.io/4511140266835968',
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV ?? 'development',
})
