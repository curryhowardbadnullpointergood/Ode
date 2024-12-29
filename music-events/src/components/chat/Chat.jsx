import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../context/ChatContext";

const Chat = ({ currentUser }) => {
  
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user}</span>
      </div>
      <Messages currentUser={currentUser}/>
      <Input currentUser={currentUser}/>
    </div>
  );
};

export default Chat;