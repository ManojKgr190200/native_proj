// db/index.ts
import { open } from '@op-engineering/op-sqlite';
import { notifyTables } from './event';

export const db = open({ name: 'app.db' });

// One entry per schema version. Never edit an old entry; add a new one.
const MIGRATIONS: string[][] = [
  // v1
  [
    `CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      is_done INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS outbox (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      op_id TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      retries INTEGER NOT NULL DEFAULT 0,
      next_retry_at INTEGER NOT NULL DEFAULT 0,
      error TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_outbox_entity ON outbox(entity_id)`,
  ],
];

export async function initDb() {
  const res = await db.execute('PRAGMA user_version');
  const current = Number(res.rows[0]?.user_version ?? 0);

  for (let v = current; v < MIGRATIONS.length; v++) {
    await db.transaction(async tx => {
      for (const sql of MIGRATIONS[v]) await tx.execute(sql);
      await tx.execute(`PRAGMA user_version = ${v + 1}`);
    });
  }
}

/** Run a write, then tell live queries on those tables to refresh. */
export async function runWrite<T>(tables: string[], fn: () => Promise<T>) {
  const result = await fn();
  notifyTables(tables);
  return result;
}