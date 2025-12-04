import React, { useEffect, useState, useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

function Pipeline() {
  const ws = useContext(WebSocketContext);
  const [stage, setStage] = useState('');
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.stage) setStage(data.stage);
      if (data.message) setMessages(prev => [...prev, data.message]);
    };
  }, [ws]);
  return (
    <div>
      <h2>Pipeline</h2>
      <p>Current Stage: {stage}</p>
      <div style={{ height: 20, background: '#eee', width: '100%', marginBottom: 10 }}>
        <div style={{ width: stage ? '100%' : '0%', background: 'green', height: '100%' }} />
      </div>
      <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', padding: 5 }}>
        {messages.map((msg, i) => (<div key={i} style={{ fontFamily: 'monospace' }}>• {msg}</div>))}
      </div>
    </div>
  );
}

export default Pipeline;