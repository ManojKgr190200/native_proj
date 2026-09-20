// App.tsx
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { initConnectivity } from './src/network/config';
import { db, initDb, runWrite } from './src/db';
import { useLiveQuery } from './src/db/useLiveQuery';

const Content = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDb().then(() => setReady(true));
  }, []);

  if (!ready) return <Text>Setting up database...</Text>;
  return <TodoTest />;
};

const TodoTest = () => {
  const { rows } = useLiveQuery<{ id: string; title: string }>(
    ['todos'],
    'SELECT id, title FROM todos ORDER BY rowid DESC',
  );

  const add = () =>
    runWrite(['todos'], () =>
      db.execute('INSERT INTO todos (id, title) VALUES (?, ?)', [
        String(Date.now()),
        `Todo ${rows.length + 1}`,
      ]),
    );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Todos in DB: {rows.length}</Text>
      <Button title="Add todo" onPress={add} />
    </View>
  );
};

const App = () => {
  useEffect(() => {
    const cleanup = initConnectivity();
    return cleanup;
  }, []);

  return (
    <Provider store={store}>
      <Content />
    </Provider>
  );
};

export default App;