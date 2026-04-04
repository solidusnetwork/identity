import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  RABBITMQ_URL: z.string().min(1),

  SESSION_PRIVATE_KEY: z.string().length(64),  // hex-encoded 32-byte Ed25519 private key

  SOLIDUS_STUB_DB_URL: z.string().min(1),
  SOLIDUS_SDK_MODE: z.enum(['stub', 'testnet', 'mainnet']).default('stub'),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment variables:')
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const config = parsed.data
export type Config = typeof config
