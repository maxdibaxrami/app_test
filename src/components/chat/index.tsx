import { motion } from "framer-motion";
import ChatList from "./chatList";
import MatchList from "./matchList";
import { ProfileBackgroundSvg } from "@/Icons/profileBackgroundSVG";

const ChatPage = () => {

  return (
    <div
      className="w-full h-full"
      style={{
        overflow: "scroll",
        marginTop:"6.5rem",
        paddingBottom: "1rem",
        zIndex: 5,
      }}
      id="chatScrollcontainer"
    >

      <div className="rounded-xl px-6 mb-2 " style={{width:"100%", height:"100%", zIndex:1}}>
        <MatchList/>
      </div>

      <motion.div transition={{ delay: 2 , duration: 2 }} initial={{opacity:0}} animate={{opacity:1}} className="absolute h-full dark:opacity-70 inset-0 flex items-center z-[-10]">
        <ProfileBackgroundSvg/>
      </motion.div>
      
      <ChatList />
      
    </div>
  );
};

export default ChatPage;
