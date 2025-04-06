// src/components/RandomChat.jsx
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Button, Card, CardBody, Textarea } from '@heroui/react';
import { SearchIcon, SendIcon } from '@/Icons';
import axios from '@/api/base';
import ChatProfileSection from '../chatPage/chatProfileSection';
import "../../pages/chat/style.css";
import MessageSection from '../chatPage/message';
import MainButton from '../miniAppButtons/MainButton';
import SecondaryButton from '../miniAppButtons/secondaryButton';
import { RandomChatSvg } from '@/Icons/randomChat';

// Define your Message interface (for clarity)
interface Message {
  senderId: string;
  recipientId: string;
  content?: string;
  mediaUrl?: string;
  timestamp: string;
}

const RandomChat = () => {
  const { data: user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const currentUserId = user.id; // Dynamic user id
  const SERVER_URL = 'https://copychic.ru/'; // Your backend URL

  // Local states with messages typed as Message[]
  const [socket, setSocket] = useState(null);
  const [filter, setFilter] = useState({ gender: '', city: '' });
  const [isWaiting, setIsWaiting] = useState(false);
  const [matched, setMatched] = useState(false);
  const [room, setRoom] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [profileDataState, setProfileDataState] = useState(null);
  const [messageUserLoading, setMessageUserLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`/users/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  };

  useEffect(() => {
    // Fetch profile data when partnerId changes
    const getProfileData = async () => {
      setMessageUserLoading(true);
      const data = await fetchProfileData();
      setProfileDataState(data);
      setMessageUserLoading(false);
    };
    if (partnerId) {
      getProfileData();
    }
  }, [partnerId]);

  const { theme } = useTheme();

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      query: { userId: currentUserId },
    });
    setSocket(newSocket);
  
    // Cleanup: disconnect on unmount
    return () => {
      void newSocket.disconnect();
    };
  }, [currentUserId, SERVER_URL]);

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
        // Expect backend sends data.message formatted as Message
        setMessages((prev) => [...prev, data.message]);
      });
    }
  }, [socket]);

  // Starts the random chat request.
  const startChat = () => {
    if (socket) {
      socket.emit('startRandomChat', { userId: currentUserId, ...filter });
      setIsWaiting(true);
    }
  };

  useEffect(()=>{
    setFilter(null)
  },[])
  // Sends a chat message.
  const sendMessage = () => {
    if (socket && room && input.trim()) {
      // Create a message object that fits your Message interface
      const message: Message = {
        senderId: currentUserId.toString(),
        recipientId: partnerId.toString(),
        content: input,
        timestamp: new Date().toISOString(),
      };
      // Emit the message to the backend
      socket.emit('sendRandomMessage', { room, message });
      // Add the message to local state
      setMessages((prev) => [...prev, message]);
      setInput('');
    }
  };

  // Cancel the chat.
  const cancelChat = () => {
    if (socket) {
      socket.emit('cancelRandomChat', { userId: currentUserId });
      socket.disconnect();
      setSocket(null);
      setIsWaiting(false);
      setMatched(false);
      setRoom('');
      setPartnerId('');
      setMessages([]);
    }
  };

  return (
    <div 
      className="relative w-screen px-5 h-full text-default-700"
      style={{
        maxHeight: "100%",
        height:"100%",
        paddingTop:"6.5rem",
        marginBottom:"3rem",
      }}
    >
      {matched && (
        <>
        <main style={{display:"flex",position:"relative", overflow: "auto", flexGrow:1 }}>

          <ChatProfileSection 
            userId2={partnerId} 
            profileDataState={profileDataState} 
            loading={messageUserLoading}
          />
          <MessageSection messages={messages} user={user} />
        </main>
          <Textarea
            className="w-full"
            value={input}
            onValueChange={setInput}
            minRows={1}
            placeholder={t("enterMessage")}
            size="lg"
            variant="flat"
            endContent={
              <Button
                onPress={sendMessage}
                isIconOnly
                size="lg"
                color="primary"
              >
                <SendIcon />
              </Button>
            }
          />
        </>
      )}

      {!matched && (
        <div className='h-[80vh] flex flex-col items-center justify-center'>
            <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                        <p className="text-base font-semibold text-center">{t("anonymous_title")}🎲</p>
                        <p className="text-xs text-center">{t("anonymous_description")}</p>
             </div>
          <RandomChatSvg/>
          {isWaiting && 
                    <Card>
                    <CardBody className='flex flex-row items-center'>
                      <SearchIcon className="size-5 m-1"/>
                      <p className='text-xs'>{t("hold_on_anonymous")}</p>
                    </CardBody>
                  </Card>
          
          }
        <button onClick={startChat}>dsa</button>
        </div>
      )}

      {!matched &&
        <MainButton
          text={t("start_chat")}
          backgroundColor="#1FB6A8"
          textColor="#FFFFFF"
          hasShineEffect={true}
          isEnabled={!matched}
          isLoaderVisible={isWaiting && !matched}
          isVisible={!matched}
          onClick={()=> startChat()}
        />
      }

      {matched &&
        <>
          <MainButton
            text={t("send_message")}
            backgroundColor="#1FB6A8"
            textColor="#FFFFFF"
            hasShineEffect={true}
            isEnabled={matched}
            isLoaderVisible={isWaiting && !matched}
            isVisible={matched}
            onClick={()=> sendMessage()}
          />

          <SecondaryButton
            text={t("end_chat")}
            backgroundColor={theme === "light"? "#FFFFFF" : "#000000"}
            textColor={theme === "light"? "#000000" : "#FFFFFF"}
            hasShineEffect={false}
            isEnabled={true}
            isVisible={true}
            position="left"
            onClick={cancelChat}
          />
        </>
      }
    </div>
  );
};

export default RandomChat;
