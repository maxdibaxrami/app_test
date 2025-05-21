import "./style.css";
import ChatLayout from "./layout";
import ChatProfileSection from "@/components/chatPage/chatProfileSection";
import MessageSection from "@/components/chatPage/message";
import ChatInput from "@/components/chatPage/chatInput";
import { Page } from "@/components/Page";
import { useLocation } from "react-router-dom";
import axios from '@/api/base';
import { useEffect, useMemo, useRef, useState } from "react";
import socketService from '@/socket/socketService'; // Import socket service
import { NotFountChatList } from "@/Icons/notFoundChatList";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { RootState } from '@/store';
import { setUserOffline, setUserOnline } from "@/features/statusSlice";
import { addMessage, setLoading, setMessages } from "@/features/messageSlice";
import MainButton from "@/components/miniAppButtons/MainButton";
import { useTheme } from "next-themes";
import SecondaryButton from "@/components/miniAppButtons/secondaryButton";
import UserProfileModal from "@/components/user/UserProfileModal";


interface Message {
  senderId: string;
  recipientId: string;
  content?: string; // Required property
  mediaUrl?: string; // Optional property
  timestamp: string;
}

export default function ChatPage() {
  
  const dispatch: AppDispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.message.data);
  const messageLoading = useSelector((state: RootState) => state.message.loading);
  const { theme } = useTheme();

  const fileInputRef = useRef(null); // Ref to control file input
  

  const [messageUserLoading , setMessageUserLoading ] = useState(true)
  const { t } = useTranslation();
  

  const [profileDataState, setProfileDataState] = useState(null);
  const [inputMessage, setInputMessage] = useState(''); // State for input message
  
  const [isUploading, setIsUploading] = useState(false); // Track the uploading state


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user1 = searchParams.get('user1');
  const user2 = searchParams.get('user2');

  const { data: user } = useSelector((state: RootState) => state.user);

  const userId2 = useMemo(
    () => user.id.toString() === user1 ? user2 : user1,
    [user,user1,user2],
  );

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`/users/?userId=${userId2}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  };
  

  const fetchMessages = async () => {
    dispatch(setLoading(true));
    
    try {
      const response = await axios.get(`/messages/chat/${userId2}/`);
      dispatch(setMessages(response.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching messages:", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    // Fetch profile data and messages
    const getProfileData = async () => {
      setLoading(true);
      setMessageUserLoading(true)
      const data = await fetchProfileData();
      setProfileDataState(data);
      setLoading(false);
      setMessageUserLoading(false)
    };

    const getMessages = async () => {
      await fetchMessages();
    };

    getProfileData(); // Fetch profile data on component mount
    getMessages(); // Fetch messages on component mount

    // Initialize socket connection after component mount
    socketService.connect(user.id.toString(), userId2);

    // Listen for incoming messages
    socketService.on("message", (message: any) => {
      dispatch(addMessage(message));
    });

            // Listen for user online/offline status
    socketService.on("userOnline", (userId: string) => {
      dispatch(setUserOnline({ userId, isOnline: true }));
    });
          
    socketService.on("userOffline", (userId: string) => {
      dispatch(setUserOffline(userId));
    });

    
  }, [user, user1, user2]);

  useEffect(()=>{
        // Listen for user online/offline status
        socketService.on("userOnline", (userId: string) => {
          dispatch(setUserOnline({ userId, isOnline: true }));
        });
      
        socketService.on("userOffline", (userId: string) => {
          dispatch(setUserOffline(userId));
        });

        return () => {
          socketService.cleanup();
        };
      
  },[dispatch])

  // Handle sending a message
  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        senderId: user.id.toString(),
        recipientId: userId2,
        content: inputMessage.trim(),
        timestamp: new Date().toISOString(),
      };
  
      dispatch(addMessage(newMessage));
      socketService.sendMessage(user.id.toString(), userId2, inputMessage.trim());
      setInputMessage('');
    }
  };

  const sendImage = (url: string) => {
    if (url) {

      const newMessage: Message = {
        senderId: user.id.toString(),
        recipientId: userId2,
        mediaUrl: url, // Optional
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(newMessage));
      socketService.sendMessageImage(user.id.toString(), userId2, "", url);
      setInputMessage('');
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("/messages/upload", formData);
      if (response.data && response.data.mediaUrl) {
        sendImage(response.data.mediaUrl);
        return response.data.mediaUrl;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      // Re-enable the file input for future uploads
      if (fileInputRef.current) {
        fileInputRef.current.disabled = false;
      }
    }
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file)
      fileInputRef.current.disabled = true; // Disable the file input after selection
    }
  };

  return (
    <Page>
      <ChatLayout>
        <ChatProfileSection userId2={userId2} profileDataState={profileDataState} loading={messageUserLoading}/>
        <main style={{display:"flex",position:"relative", overflow: "auto", flexGrow:1 }}>
          {messageLoading && 
            <motion.div transition={{type:"spring"}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{borderRadius:"12px"}} className="absolute backdrop-blur p-3 backdrop-saturate-150 bg-neutral/30 top-1/2 z-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Spinner color="current" size="lg"/>
            </motion.div>
          }
          
          {!messageLoading && messages.length === 0 && 
            <motion.div transition={{type:"spring"}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{borderRadius:"12px"}} className="flex items-center justify-center flex-col absolute backdrop-blur p-3 backdrop-saturate-150 bg-neutral/30 top-1/2 z-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <NotFountChatList/>
              <p className="text-tiny text-center">{t("noMessages")}</p>
            </motion.div>
          }
          <MessageSection user={user} messages={!messageLoading? messages : []} /> {/* Pass messages to MessageSection */}
        </main>
        <ChatInput 
          inputMessage={inputMessage} 
          setInputMessage={setInputMessage} 
        />
     
      </ChatLayout>

      <input
              type="file"
              accept="image/*, .heic"  // Include HEIC format along with image types
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef} // Link file input with ref
      />

      <UserProfileModal />
      
      <MainButton
        text={t("send_message")}
        backgroundColor="#1FB6A8"
        textColor="#FFFFFF"
        hasShineEffect={location.pathname === "/edit-profile-field"}
        isEnabled={true}
        isLoaderVisible={false}
        isVisible={true}
        onClick={()=> sendMessage()}
      />

      <SecondaryButton
        text={t("upload_Photo")}
        backgroundColor={theme === "light"? "#FFFFFF" : "#000000"}
        textColor={theme === "light"? "#000000" : "#FFFFFF"}
        hasShineEffect={false}
        isEnabled={true}
        isLoaderVisible={isUploading}
        isVisible={true}
        position="left"
        onClick={() => fileInputRef.current.click()}
      />
    </Page>
  );
}
