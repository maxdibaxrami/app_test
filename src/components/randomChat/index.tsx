// src/components/RandomChat.tsx
import { RootState } from '@/store';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Textarea } from '@heroui/react';
import axios from '@/api/base';
import ChatProfileSection from '../chatPage/chatProfileSection';
import MessageSection from '../chatPage/message';
import MainButton from '../miniAppButtons/MainButton';
import SecondaryButton from '../miniAppButtons/secondaryButton';
import { RandomChatSvg } from '@/Icons/randomChat';
import "../../pages/chat/style.css";

import Lottie from "lottie-react";
import animationData from "@/components/animate/searchAnimation.json";

// Define your Message interface
interface Message {
  senderId: string;
  recipientId: string;
  content?: string;
  mediaUrl?: string;
  timestamp: string;
}

const SERVER_URL = 'https://copychic.ru/'; // Your backend URL

const RandomChat = () => {
  const { data: user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUserId = user.id.toString();

  // Local state variables
  const [socket, setSocket] = useState(null);
  const [filter, setFilter] = useState<{ gender: string; city: string }>({ gender: '', city: '' });
  const [isWaiting, setIsWaiting] = useState(false);
  const [matched, setMatched] = useState(false);
  const [room, setRoom] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [profileDataState, setProfileDataState] = useState<any>(null);
  const [messageUserLoading, setMessageUserLoading] = useState(true);
  const [chatCancelledMessage, setChatCancelledMessage] = useState('');

  // Fetch partner profile data
  const fetchProfileData = useCallback(async () => {
    try {
      const response = await axios.get(`/users/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) {
      const getProfileData = async () => {
        setMessageUserLoading(true);
        const data = await fetchProfileData();
        setProfileDataState(data);
        setMessageUserLoading(false);
      };
      getProfileData();
    }
  }, [partnerId, fetchProfileData]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      query: { userId: currentUserId },
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId]);

  useEffect(()=>{
    setFilter(null)
  },[])
  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onWaiting = (data: any) => {
      console.log('Waiting for partner:', data);
      setIsWaiting(true);
    };

    const onMatched = (data: { room: string; partnerId: string }) => {
      console.log('Matched with partner:', data);
      setRoom(data.room);
      setPartnerId(data.partnerId);
      setMatched(true);
      setIsWaiting(false);
    };

    const onMessage = (data: { message: Message }) => {
      // Append new message to state using functional update.
      setMessages((prev) => [...prev, data.message]);
    };

    const onChatCancelled = (data: { message: string }) => {
      console.log('Chat cancelled:', data);
      setChatCancelledMessage(data.message);
      // Reset chat state
      setMatched(false);
      setRoom('');
      setPartnerId('');
      setMessages([]);
      
    };

    socket.on('waitingForPartner', onWaiting);
    socket.on('randomChatMatched', onMatched);
    socket.on('randomMessage', onMessage);
    socket.on('chatCancelled', onChatCancelled);

    return () => {
      socket.off('waitingForPartner', onWaiting);
      socket.off('randomChatMatched', onMatched);
      socket.off('randomMessage', onMessage);
      socket.off('chatCancelled', onChatCancelled);
    };
  }, [socket]);

  // Handler: Start Chat
  const startChat = useCallback(() => {
    if (socket) {
      socket.emit('startRandomChat', { userId: currentUserId, ...filter });
      setIsWaiting(true);
    }
  }, [socket, currentUserId, filter]);

  // Handler: Send Message
  const sendMessage = useCallback(() => {
    if (socket && room && input.trim()) {
      const message: Message = {
        senderId: currentUserId,
        recipientId: partnerId,
        content: input,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendRandomMessage', { room, message });
      setMessages((prev) => [...prev, message]);
      setInput('');
    }
  }, [socket, room, input, currentUserId, partnerId]);

  // Handler: Cancel Chat (Notify backend and update UI)
  const cancelChat = useCallback(() => {
    if (socket) {
      // Pass room info if available
      socket.emit('cancelRandomChat', { userId: currentUserId, room });
      // Optionally, immediately update state for a snappy UI
      setMatched(false);
      setRoom('');
      setPartnerId('');
      setMessages([]);
    }
  }, [socket, currentUserId, room]);

  return (
    <div 
      className="relative w-screen px-5 h-full text-default-700"
      style={{
        maxHeight: "100%",
        paddingTop: "6.5rem",
        marginBottom: "3rem",
      }}
    >
      {chatCancelledMessage && (
        <div className="chat-cancelled-message">
          <p>{chatCancelledMessage}</p>
        </div>
      )}

      {isWaiting?
        <div className='h-[70vh]'>
          <Lottie animationData={animationData} loop={true} autoplay={true} />
        </div>
      :
        matched ? 
          <div className="h-full flex flex-col relative">
            <ChatProfileSection 
              userId2={partnerId} 
              profileDataState={profileDataState} 
              loading={messageUserLoading}
              position={false}
              online={true}
            />
            <main style={{ display: "flex", position: "relative", overflow: "auto", flexGrow: 1 }}>
              <MessageSection disablePadding={true} messages={messages} user={user} />
            </main>
            <Textarea
              className="w-full"
              value={input}
              onValueChange={setInput}
              minRows={1}
              placeholder={t("enterMessage")}
              size="lg"
              variant="flat"
            />
          </div>
         : 
          <div className="h-[80vh] flex flex-col items-center justify-center">
            <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
              <p className="text-base font-semibold text-center">{t("anonymous_title")} 🎲</p>
              <p className="text-xs text-center">{t("anonymous_description")}</p>
            </div>
            <RandomChatSvg />
            <button onClick={startChat} className="mt-4">
              {t("start_chat")}
            </button>

            <button onClick={cancelChat} className="mt-4">
              {t("end chat")}
            </button>
            {isWaiting && <p>{t("waiting_for_partner")}</p>}
          </div>
        
      }

      

      {/* Action Buttons */}
      {!matched && (
        <MainButton
          text={t("start_chat")}
          backgroundColor="#1FB6A8"
          textColor="#FFFFFF"
          hasShineEffect={true}
          isEnabled={!matched}
          isLoaderVisible={isWaiting && !matched}
          isVisible={!matched}
          onClick={startChat}
        />
      )}

      {matched && (
        <SecondaryButton
          text={t("end_chat")}
          backgroundColor={theme === "light" ? "#FFFFFF" : "#000000"}
          textColor={theme === "light" ? "#000000" : "#FFFFFF"}
          hasShineEffect={false}
          isEnabled={true}
          isVisible={true}
          position="left"
          onClick={cancelChat}
        />
      )}

      {matched && (
        <MainButton
          text={t("send_message")}
          backgroundColor="#1FB6A8"
          textColor="#FFFFFF"
          hasShineEffect={true}
          isEnabled={matched}
          isLoaderVisible={isWaiting && !matched}
          isVisible={matched}
          onClick={sendMessage}
        />
      )}
    </div>
  );
};

export default RandomChat;
