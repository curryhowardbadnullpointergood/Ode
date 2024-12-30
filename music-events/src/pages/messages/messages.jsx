import "./messages.scss"
import Sidebar from '../../components/chat/Sidebar'
import Chat from '../../components/chat/Chat'
import AuthContext from "../../authentication/AuthContext";
import { useContext } from "react";

const Messages = () => {

  const{userData} = useContext(AuthContext);

  console.log( userData );

  const currentUser = userData.username;

  console.log( currentUser );

  return (
    <div className='chatMain'>
      <div className="chatContainer">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Messages;
