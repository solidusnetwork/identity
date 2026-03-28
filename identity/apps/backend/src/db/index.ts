import postgres from 'postgres'
import { config } from '../config.js'

let _sql: postgres.Sql | null = null

export function getSql(): postgres.Sql {
  if (!_sql) {
    _sql = postgres(config.DATABASE_URL, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 10,
      transform: { undefined: null },
    })
  }
  return _sql
}

export async function closeDb(): Promise<void> {
  await _sql?.end()
  _sql = null
}
