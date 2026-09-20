// db/useLiveQuery.ts
import { useEffect, useState } from 'react';
import { db } from './index';
import { subscribeTable } from './event';

export function useLiveQuery<T = Record<string, any>>(
  tables: string[],
  sql: string,
  params: any[] = [],
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const res = await db.execute(sql, params);
      if (active) {
        setRows(res.rows as T[]);
        setLoading(false);
      }
    };

    run();
    const unsubscribers = tables.map(t => subscribeTable(t, run));

    return () => {
      active = false;
      unsubscribers.forEach(u => u());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sql, JSON.stringify(params), tables.join(',')]);

  return { rows, loading };
}