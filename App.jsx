import React, { useState } from 'react';
import Pipeline from './Pipeline';
import Dashboard from './Dashboard';
import { WebSocketProvider } from './WebSocketContext';

function App() {
  const [description, setDescription] = useState('');
  const [started, setStarted] = useState(false);
  const handleSubmit = () => setStarted(true);
  return (
    <WebSocketProvider>
      <div style={{ padding: 20 }}>
        {!started ? (
          <div>
            <h1>One-Step App Creator</h1>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleSubmit}>Create App</button>
          </div>
        ) : (
          <>
            <Pipeline description={description} />
            <Dashboard />
          </>
        )}
      </div>
    </WebSocketProvider>
  );
}

export default App;