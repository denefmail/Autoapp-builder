import React, { useEffect, useState, useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

function Dashboard() {
  const ws = useContext(WebSocketContext);
  const [diary, setDiary] = useState({ entry_id: 'demo', steps: [] });
  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.stage && data.message) {
        setDiary(prev => ({...prev, steps: [...prev.steps, { stage: data.stage, message: data.message }]}));
      }
    };
  }, [ws]);
  return (
    <div>
      <h2>Dev Diary</h2>
      <pre>{JSON.stringify(diary.steps, null, 2)}</pre>
    </div>
  );
}

export default Dashboard;