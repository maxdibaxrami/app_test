// src/hooks/useChatSocket.ts
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'https://mix-app-database.up.railway.app/';

const useChatSocket = (userId: string) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      query: { userId },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useChatSocket;
