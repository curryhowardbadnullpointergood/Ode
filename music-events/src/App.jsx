import React from "react";

// pages 

import Login from "./pages/login/login"; //Anna - changed Login to login (changed it back before pushing)
import Register from "./pages/register/Register";
import Profile from "./pages/profile/profile"
import Notifications from "./pages/notification/notification"
import Organisation from "./pages/organisation/organisation"
import AdminRegister from "./pages/register/AdminRegister" //Anna

import Chat from "./pages/messages/chat"
import ProtectedRoute from "./authentication/ProtectedRoute "


import { BrowserRouter as Router,  Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
// do not remove router, else thinfs in here break, for some reason?? really bizare what is going on here ? 


// layouts 
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/home/home";


import { ChatContextProvider } from "./context/ChatContext";

import UpdateProfile from "./pages/profile/UpdateProfile";





// login needs to Change as the other pages are developed been used as a placeholder here 
// for ease of chage for those that do not understand quite how route dom works, 
// if you are working on a dynamic page, one where there's "id" involved ie profile, 
// then lmk if you can't get it to work, this basic version of rendering doesn't work for them needs to be tweaked a bit 


// changing the routing a bit for better code quality

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/profile" element={<div> Profile</div>} />  //this needs to be dynamic, so need to have id on here, and be inside the layout*/}
        {/* think og like a instagram like profile page  */}
        
        {/* sort of like a facebook home page, maybe? to be decided tbh  */}
        <Route path="/register" element={<Register/>} />
        {/* simple modern register page  */}

        <Route path="/register-admin" element={<AdminRegister/>} /> {/*Anna*/}

        {/* this is the chat/group chat, think of discord like, might not get done tbh  */}
        <Route path="/videofeed" element={<div> Video Feed</div>} />  
        {/* this is the video add sort of thing  */}
        <Route path="/" element={<div> Hello world</div>} />
        {/* this is to prank the slackers when they try run npm start and see the front end not exist lol  */}

        <Route path="/organisation/:id" element={<Organisation/>} />  

        <Route path="/" element={<MainLayout/>}>


        <Route path="/chat" element={<Chat/>} />

        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} /> {/* not sure if home should be secure from outsiders  */}


          <Route path="/profile/:id" element= {<Profile/>} /> 
          {/* Allright so this basically makes suer that the components are like children of the main layout, we might need more layouts in the future but again that would increase complexity 
          and so we should try and avoid that, well I should anyway, if you realise that we for some reason need a new layout style, let me know */}
          
          <Route path="/update_profile" element= {<ProtectedRoute><UpdateProfile/></ProtectedRoute>} /> {/*the update page for profile*/}

          <Route path="/notification" element={<Notifications/>} />

        

        </Route>


      </Route>
  )
)

function App() {

  // this is for the integration, making that easier to think about, 

  const isUser = false; 
  
  // turn this flag to true for the autentication, we can protect the routes this way by prohibiting, ore redirecting the user 
  // to the login page, or the register page, of course, can take this a couple steps further, but don't think that is necessary for this 
  // coursework, who know though, if we have time, can try to do a partial load of the page, which requires some dynamic routing, 
  // then show like a login page if you want to see further, sort of like instagram does. 


  return (
   
      <RouterProvider router={route} />

  );
}

export default App;