import React from "react";
import Chats from "./Chats"
import Navbar from "./Navbar"

const Sidebar = () => {
  
  return (
    <div className="sidebar">
      <Navbar/>
      <Chats/>
    </div>
  );
};

export default Sidebar;