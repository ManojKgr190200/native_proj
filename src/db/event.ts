// db/events.ts
type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

export const subscribeTable = (table: string, listener: Listener) => {
  if (!listeners.has(table)) listeners.set(table, new Set());
  listeners.get(table)!.add(listener);
  return () => {
    listeners.get(table)?.delete(listener);
  };
};

export const notifyTables = (tables: string[]) => {
  tables.forEach(t => listeners.get(t)?.forEach(l => l()));
};