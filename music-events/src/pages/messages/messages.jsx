import "./messages.scss"
import Sidebar from '../../components/chat/Sidebar'
import Chat from '../../components/chat/Chat'
import React, { useState, useEffect } from "react"; 
import { useParams } from "react-router-dom";      


const Messages = () => {

  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
      if (id) {
          setCurrentUser(id); 
      }
  }, [id]);

  return (
    <div className='chatMain'>
      <div className="chatContainer">
        <Sidebar currentUser={currentUser}/>
        <Chat currentUser={currentUser}/>
      </div>
    </div>
  )
}

export default Messages;
