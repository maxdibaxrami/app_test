// src/components/RandomChat.tsx
import { RootState } from '@/store';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { addToast, Input } from '@heroui/react';
import axios from '@/api/base';
import ChatProfileSection from '../chatPage/chatProfileSection';
import MessageSection from '../chatPage/message';
import MainButton from '../miniAppButtons/MainButton';
import SecondaryButton from '../miniAppButtons/secondaryButton';
import { RandomChatSvg } from '@/Icons/randomChat';
import "../../pages/chat/style.css";
import Lottie from "lottie-react";
import animationData from "@/components/animate/searchAnimation.json";

import { 
  startWaiting, chatMatched, addMessage, cancelChat as cancelChatAction, resetChat 
} from '@/features/chatSlice';
import useChatSocket from '@/socket/useChatSocket';
import { Page } from '../Page';
import ChatLayout from '@/pages/chat/layout';

interface Message {
  senderId: string;
  recipientId: string;
  content?: string;
  mediaUrl?: string;
  timestamp: string;
}

const RandomChat = () => {

  const { data: user } = useSelector((state: RootState) => state.user);
  const chatState = useSelector((state: RootState) => state.chat);
  
  useEffect(()=>{
    console.log(chatState)
  },[chatState])

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUserId = user.id.toString();
  const socket = useChatSocket(currentUserId);

  // Local state for filters and input; socket is managed via custom hook.
  const [filter, setFilter] = useState<{ gender: string; city: string }>({ gender: '', city: '' });
  const [input, setInput] = useState('');
  const [profileDataState, setProfileDataState] = useState<any>(null);
  const [messageUserLoading, setMessageUserLoading] = useState(true);


  useEffect(()=>{
    setFilter(null)
  },[])

  // Fetch partner profile data
  const fetchProfileData = useCallback(async () => {
    try {
      const response = await axios.get(`/users/?userId=${chatState.partnerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  }, [chatState.partnerId]);

  useEffect(() => {
    if (chatState.partnerId) {
      const getProfileData = async () => {
        setMessageUserLoading(true);
        const data = await fetchProfileData();
        setProfileDataState(data);
        setMessageUserLoading(false);
      };
      getProfileData();
    }
  }, [chatState.partnerId, fetchProfileData]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onWaiting = (data: any) => {
      console.log('Waiting for partner:', data);
      dispatch(startWaiting());
    };

    const onMatched = (data: { room: string; partnerId: string }) => {
      console.log('Matched with partner:', data);
      dispatch(chatMatched({ room: data.room, partnerId: data.partnerId }));
    };

    const onMessage = (data: { message: Message }) => {
      console.log(data)
      const message: Message = {
        senderId: chatState.partnerId,
        recipientId: currentUserId,
        content: data.message.toString(),
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(message));
    };

    const onChatCancelled = (data: { message: string }) => {
      console.log('Chat cancelled:', data);
      dispatch(cancelChatAction({ chatCancelledMessage: data.message }));
      addToast({
        title: t("randomchat_error_title"),
        description: t("randomchat_error_text"),
        color: "secondary",
      });
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
  }, [socket, dispatch, t]);

  // Handler: Start Chat
  const startChat = useCallback(() => {
    if (socket) {
      socket.emit('startRandomChat', { userId: currentUserId, ...filter });
      dispatch(startWaiting());
    }
  }, [socket, currentUserId, filter, dispatch]);

  // Handler: Send Message
  const sendMessage = useCallback(() => {
    if (socket && chatState.room && input.trim()) {
      const message: Message = {
        senderId: currentUserId,
        recipientId: chatState.partnerId,
        content: input,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendRandomMessage', { room: chatState.room, message });
      dispatch(addMessage(message));
      setInput('');
    }
  }, [socket, chatState.room, input, currentUserId, chatState.partnerId, dispatch]);

  // Handler: Cancel Chat
  const cancelChat = useCallback(() => {
    if (socket) {
      socket.emit('cancelRandomChat', { userId: currentUserId, room: chatState.room });
      // Reset Redux chat state (this persists even if the route changes)
      dispatch(resetChat());
    }
  }, [socket, currentUserId, chatState.room, dispatch]);


  return (
      <Page>
        <div 
          className="relative w-screen h-full text-default-700"
          style={{
            maxHeight: "100%",
          }}
        >

          {chatState.isWaiting? 
            <div style={{paddingTop: "4.5rem"}} className="h-[75vh] px-5 flex flex-col items-center">
              <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                <p className="text-base font-semibold text-center">{t("anonymous_title")} 🎲</p>
                <p className="text-xs text-center">{t("anonymous_description")}</p>
              </div>
              <Lottie animationData={animationData} loop={true} autoplay={true} />
            </div>
            :chatState.isActive ? (
              <ChatLayout>
                <ChatProfileSection 
                  userId2={chatState.partnerId} 
                  profileDataState={profileDataState} 
                  loading={messageUserLoading}
                />
                <main style={{ display: "flex", position: "relative", overflow: "auto", flexGrow: 1 }}>
                  <MessageSection messages={chatState.messages} user={user} />
                </main>
                <Input
                  className="w-full"
                  value={input}
                  onValueChange={setInput}
                  placeholder={t("enterMessage")}
                  size="lg"
                  variant="flat"
                />
              </ChatLayout>
            ) : (
              <div style={{paddingTop: "4.5rem"}}  className="h-[80vh] px-5 flex flex-col items-center">
                <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                  <p className="text-base font-semibold text-center">{t("anonymous_title")} 🎲</p>
                  <p className="text-xs text-center">{t("anonymous_description")}</p>
                </div>
                <RandomChatSvg />
              </div>
            )
          }
          {/* Action Buttons */}
          <MainButton
            text={chatState.isActive ? t("send_message") : t("start_chat")}
            backgroundColor="#1FB6A8"
            textColor="#FFFFFF"
            hasShineEffect={true}
            // When active, enable the button. Otherwise, only enable it if not waiting.
            isEnabled={chatState.isActive ? chatState.isActive : !chatState.isWaiting}
            // Show the loader only when waiting and not active.
            isLoaderVisible={chatState.isWaiting && !chatState.isActive}
            // You could always show the button; if you need conditional visibility, adjust accordingly.
            isVisible={!chatState.isWaiting}
            // Choose the onClick handler based on whether chat is active.
            onClick={chatState.isActive ? sendMessage : startChat}
          />



          {(chatState.isWaiting || chatState.isActive) && (
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

          
        </div>
      </Page>

  );
};

export default RandomChat;
