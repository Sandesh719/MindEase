// src/components/chat/Context/ChatProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
      setUser(userInfo);

      if (!userInfo) {
        // if not logged in, redirect to home
        //window.location.href("http://localhost:5173/");
        return;
      }
    } catch (e) {
      console.warn("ChatProvider: failed to parse localStorage userInfo", e);
      window.location.href("http://localhost:5173/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;