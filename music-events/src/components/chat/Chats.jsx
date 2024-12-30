import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import AuthContext from "../../authentication/AuthContext";
import { db } from "./firebase";


const Chats = () => {
  const [chats, setChats] = useState([]);
  const { dispatch } = useContext(ChatContext);

  const{userData} = useContext(AuthContext);
  const currentUser = userData.username;

  useEffect(() => {

    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser && getChats();
  }, [currentUser]);

  const handleSelect = (selectedUser, currentUser) => {
   
    const chatId =
        currentUser > selectedUser
            ? currentUser + "_" + selectedUser
            : selectedUser + "_" + currentUser;

    dispatch({
        type: "CHANGE_USER",
        payload: {
            user: selectedUser, 
            chatId: chatId   
        }
    });
  };

  return (
    <div className="chats">
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo.displayName, currentUser)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;