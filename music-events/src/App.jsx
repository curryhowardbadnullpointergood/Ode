import React from "react";
import Login from "./pages/login/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// login needs to Change as the other pages are developed been used as a placeholder here 
// for ease of chage for those that do not understand quite how route dom works, 
// if you are working on a dynamic page, one where there's "id" involved ie profile, 
// then lmk if you can't get it to work, this basic version of rendering doesn't work for them needs to be tweaked a bit 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<div> Profile</div>} />
        {/* think og like a instagram like profile page  */}
        <Route path="/home" element={<div> Home</div>} />
        {/* sort of like a facebook home page, maybe? to be decided tbh  */}
        <Route path="/register" element={<div> Register</div>} />
        {/* simple modern register page  */}
        <Route path="/chat" element={<div> Chat</div>} />
        {/* this is the chat/group chat, think of discord like, might not get done tbh  */}
        <Route path="/videofeed" element={<div> Video Feed</div>} />  
        {/* this is the video add sort of thing  */}
        <Route path="/" element={<div> Hello world</div>} />
        {/* this is to prank the slackers when they try run npm start and see the front end not exist lol  */}
      </Routes>
    </Router>
  );
}

export default App;