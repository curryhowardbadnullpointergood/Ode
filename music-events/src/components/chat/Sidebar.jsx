import React from "react";
import Chats from "./Chats"

const Sidebar = ({ currentUser }) => {
  
  return (
    <div className="sidebar">
      <Chats currentUser={currentUser}/>
    </div>
  );
};

export default Sidebar;