import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'
import { generateKeypair } from '@solidus/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function createDatabaseIfNotExists(sql: postgres.Sql, dbName: string): Promise<void> {
  const rows = await sql`SELECT datname FROM pg_database WHERE datname = ${dbName}`
  if (rows.length === 0) {
    await sql.unsafe(`CREATE DATABASE ${dbName}`)
    console.log(`✓ Created database: ${dbName}`)
  } else {
    console.log(`  Database already exists: ${dbName}`)
  }
}

async function main(): Promise<void> {
  const systemSql = postgres('postgresql://localhost/postgres', { max: 1 })
  await createDatabaseIfNotExists(systemSql, 'solidus_identity')
  await systemSql.end()

  // Run identity migrations
  const identitySql = postgres('postgresql://localhost/solidus_identity', { max: 1 })
  const migrationPath = join(__dirname, '../src/db/migrations/001_schema.sql')
  const migration = readFileSync(migrationPath, 'utf-8')
  await identitySql.unsafe(migration)
  await identitySql.end()
  console.log('✓ Identity migrations complete (001_schema)')

  // Run 002_sharing.sql
  const identitySql2 = postgres('postgresql://localhost/solidus_identity', { max: 1 })
  const sharingPath = join(__dirname, '../src/db/migrations/002_sharing.sql')
  const sharingMigration = readFileSync(sharingPath, 'utf-8')
  await identitySql2.unsafe(sharingMigration)
  await identitySql2.end()
  console.log('✓ Identity migrations complete (002_sharing)')

  // Run 003_social.sql
  const identitySql3 = postgres('postgresql://localhost/solidus_identity', { max: 1 })
  const socialPath = join(__dirname, '../src/db/migrations/003_social.sql')
  const socialMigration = readFileSync(socialPath, 'utf-8')
  await identitySql3.unsafe(socialMigration)
  await identitySql3.end()
  console.log('✓ Identity migrations complete (003_social)')

  // Generate session key
  const sessionKp = await generateKeypair()

  const separator = '─'.repeat(50)
  console.log('')
  console.log('Copy this to identity/apps/backend/.env:')
  console.log(separator)
  console.log(`SESSION_PRIVATE_KEY=${sessionKp.privateKey}`)
  console.log(`DATABASE_URL=postgresql://localhost/solidus_identity`)
  console.log(`SOLIDUS_STUB_DB_URL=postgresql://localhost/solidus_stub`)
  console.log(`REDIS_URL=redis://localhost:6379`)
  console.log(`RABBITMQ_URL=amqp://localhost:5672`)
  console.log(`PORT=3001`)
  console.log(`HOST=0.0.0.0`)
  console.log(`NODE_ENV=development`)
  console.log(`SOLIDUS_SDK_MODE=stub`)
  console.log(separator)
}

main().catch((err) => {
  console.error('Bootstrap failed:', err)
  process.exit(1)
})
