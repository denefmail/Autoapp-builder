import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [ws, setWs] = useState(null);
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:5000`);
    setWs(socket);
    return () => socket.close();
  }, []);
  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
}