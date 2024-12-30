import React, { useContext } from 'react'
import AuthContext from "../../authentication/AuthContext";

const Navbar = () => {

  const{userData} = useContext(AuthContext);
  const currentUser = userData.username;

  return (
    <div className='navbar'>
      <span className="logo">Chat</span>
      <div className="user">
        <img src={userData.profile_picture} alt="" />
        <span>{currentUser}</span>
      </div>
    </div>
  )
}

export default Navbar