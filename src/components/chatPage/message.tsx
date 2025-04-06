// src/components/MessageSection.jsx
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useCallback, useRef, useEffect } from "react";
import { Image } from "@heroui/react";
import { BASEURL } from "@/constant";
import { SeenIcon } from "@/Icons";
import "./style.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const MessageSection = ({ messages, user }) => {
  const { theme } = useTheme();
  const divRef = useRef(null);

  // Sort messages by timestamp
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Scroll to the bottom when messages change
  const moveBottom = useCallback(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [sortedMessages]);

  useEffect(() => {
    moveBottom();
  }, [sortedMessages, moveBottom]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      ref={divRef}
      className={`${
        theme === "light"
          ? "message-container-light"
          : "message-container-dark"
      } w-full flex flex-col border-small px-1 gradient--telegram rounded-small border-default-200 dark:border-default-100`}
      style={{ overflow: "scroll", paddingTop: "118px" }}
    >
      {sortedMessages.map((msg, index) => {
        const isCurrentUser = msg.senderId === user.id;
        const messageType = isCurrentUser ? "me" : "you";

        if (msg.type === "time") {
          return (
            <motion.div key={index} variants={messageVariants} className="mb-2">
              <p className="time">{msg.time}</p>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={index}
            variants={messageVariants}
            className={`chat-${messageType} chat-m ${
              messageType === "me"
                ? "backdrop-blur bg-neutral/40 backdrop-saturate-150"
                : "backdrop-blur bg-primary/80 backdrop-saturate-150"
            } flex flex-col`}
          >
            <div className={`chat-bubble chat-${messageType}`}>
              {!msg.mediaUrl && <p>{msg.content}</p>}
              {msg.mediaUrl && (
                <Image
                  alt="conversation"
                  className="chat-image"
                  src={`${BASEURL}${msg.mediaUrl}`}
                />
              )}
              <small
                className={`chat${messageType}--time flex items-center w-90 justify-between`}
              >
                {formatTimestamp(msg.timestamp)}{" "}
                {msg.readAt && <SeenIcon className="size-4 mx-2" />}
              </small>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default MessageSection;
