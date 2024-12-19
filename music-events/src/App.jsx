import React from "react";
import Login from "./pages/login/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Login />} />
        {/* think og like a instagram like profile page  */}
        <Route path="/home" element={<Login />} />
        {/* sort of like a facebook home page, maybe? to be decided tbh  */}
        <Route path="/register" element={<Login />} />
        {/* simple modern register page  */}
        <Route path="/chat" element={<Login />} />
        {/* this is the chat/group chat, think of discord like, might not get done tbh  */}
        <Route path="/videofeed" element={<Login />} />  
        {/* this is the video add sort of thing  */}
        <Route path="/" element={<div> Hello world</div>} />
        {/* this is to prank the slackers when they try run npm start and see the front end not exist lol  */}
      </Routes>
    </Router>
  );
}

export default App;