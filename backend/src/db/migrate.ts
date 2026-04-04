import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSql, closeDb } from './index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function runMigrations(): Promise<void> {
  const sql = getSql()
  const migrationPath = join(__dirname, 'migrations', '001_schema.sql')
  const migration = readFileSync(migrationPath, 'utf-8')
  await sql.unsafe(migration)
}

if (process.argv[1]?.endsWith('migrate.js') || process.argv[1]?.endsWith('migrate.ts')) {
  runMigrations()
    .then(() => { console.log('Migrations complete'); return closeDb() })
    .catch((err) => { console.error(err); process.exit(1) })
}
