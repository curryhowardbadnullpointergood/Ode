import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../context/ChatContext";

const Message = ({ message, currentUser }) => {

  const { data } = useContext(ChatContext);

  const ref = useRef();

  const formattedTime = message.timestamp
        ? (message.timestamp.toDate
            ? message.timestamp.toDate().toLocaleString() 
            : new Date(message.timestamp).toLocaleString()) 
        : "N/A";

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.sender === currentUser && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.sender === currentUser
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{formattedTime}</span>
      </div>
      <div className="messageContent">
        {message.message && <p>{message.message}</p>}
        {message.image && <img src={message.image} alt="" />}
      </div>
    </div>
  );
};

export default Message;