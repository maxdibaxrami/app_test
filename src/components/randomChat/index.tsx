// src/components/RandomChat.jsx
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const RandomChat = () => {
  const { data : user } = useSelector((state: RootState) => state.user);

  const currentUserId = user.id; // Replace with your dynamic user id
  const SERVER_URL = 'https://copychic.ru/'; // Update this to match your backend URL

  // Local states
  const [socket, setSocket] = useState(null);
  const [filter, setFilter] = useState({ gender: '', city: '' });
  const [isWaiting, setIsWaiting] = useState(false);
  const [matched, setMatched] = useState(false);
  const [room, setRoom] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      query: { userId: currentUserId },
    });
    setSocket(newSocket);
  
    // Cleanup: disconnect and ensure nothing is returned
    return () => {
      void newSocket.disconnect();
    };
  }, [currentUserId]);

  // Listen for Socket.IO events.
  useEffect(() => {
    if (socket) {
      socket.on('waitingForPartner', (data) => {
        console.log('Waiting for partner:', data);
        setIsWaiting(true);
      });
      socket.on('randomChatMatched', (data) => {
        console.log('Matched with partner:', data);
        setRoom(data.room);
        setPartnerId(data.partnerId);
        setMatched(true);
        setIsWaiting(false);
      });
      socket.on('randomMessage', (data) => {
        setMessages((prev) => [...prev, { message: data.message, sender: 'partner' }]);
      });
    }
  }, [socket]);

  // Starts the random chat request. You can either emit a socket event or call a REST endpoint.
  // Here we use the socket event for immediate pairing.
  const startChat = async () => {
    if (socket) {
      socket.emit('startRandomChat', { userId: currentUserId, ...filter });
      setIsWaiting(true);
    }
  };

  // Sends a chat message to the room.
  const sendMessage = () => {
    if (socket && room && input.trim()) {
      socket.emit('sendRandomMessage', { room, message: input });
      setMessages((prev) => [...prev, { message: input, sender: 'me' }]);
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem', paddingTop:"100px" }}>
      <h2>Random Chat</h2>

      {!matched && (
        <div>
          <input
            type="text"
            placeholder="Preferred Gender (optional)"
            value={filter.gender}
            onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
            style={{ marginRight: '1rem' }}
          />
          <input
            type="text"
            placeholder="City (optional)"
            value={filter.city}
            onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={startChat}>Start Chat</button>
        </div>
      )}

      {isWaiting && !matched && <p>Waiting for a chat partner...</p>}

      {matched && (
        <div>
          <h3>Chat Room: {room}</h3>
          <p>Chatting with user: {partnerId}</p>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              margin: '1rem 0',
              height: '300px',
              overflowY: 'auto',
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.sender === 'me' ? 'right' : 'left', margin: '0.5rem 0' }}>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: '80%', marginRight: '1rem' }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default RandomChat;
