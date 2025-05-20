import { motion } from "framer-motion";
import ChatList from "./chatList";
import MatchList from "./matchList";
import { ProfileBackgroundSvg } from "@/Icons/profileBackgroundSVG";
import { Link } from "react-router-dom";
import { Card } from "@heroui/react";
import { useTranslation } from "react-i18next";

const ChatPage = () => {
  const { t } = useTranslation();

  return (
    <div
      className="w-full h-full"
      style={{
        overflow: "scroll",
        marginTop:"4rem",
        paddingBottom: "1rem",
        zIndex: 5,
      }}
      id="chatScrollcontainer"
    >



      <div className="rounded-xl px-6 mb-2 " style={{width:"100%", height:"100%", zIndex:1}}>
        <MatchList/>
      </div>

              <div className="mx-4">
          <Card shadow="none" isPressable as={Link} to={"/random-chat"} className="border-1 border-default-200 dark:border-default-100  backdrop-blur bg-primary/0" radius="lg">
            <div className="flex items-center p-1 py-3 h-full">
                <div>
                  <p className="text-4xl px-4 p-2">🎲</p>
                </div>
                <div>
                    <p className="text-base font-bold">{t('anonymous_chat')} </p>
                    <p className="text-xs">{t("anonymous_description")}</p>
                </div>

            </div>
          </Card>
        </div>
        

      <motion.div transition={{ delay: 2 , duration: 2 }} initial={{opacity:0}} animate={{opacity:1}} className="absolute h-full dark:opacity-70 inset-0 flex items-center z-[-10]">
        <ProfileBackgroundSvg/>
      </motion.div>
      
      <ChatList />
      
    </div>
  );
};

export default ChatPage;
