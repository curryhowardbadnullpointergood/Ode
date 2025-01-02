import { Link } from "react-router-dom";
import "./navBar.scss"
import {useContext} from "react";

import hahn from "../../assets/Hahn.jpg";
import placeholder from "../../assets/placeholder.jpg"
import AuthContext from "../../authentication/AuthContext";

// literally the basic navbar example for the documentation, should really change in the future 

// importing the icons, maybe in the future we can have someone redo the icon design in illustrator
// is that overkill? ugh maybe 
import { IoHomeSharp } from "react-icons/io5";
import { IoMusicalNote } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io"; // this is for the notifications of the event and if someone tagged the user or well discord tag / instagram at 
import { BiSolidMessageSquare } from "react-icons/bi"; // this is for messages in the group chats/ direct messages between users etc 

// for now the name of the app is Ode, sounds allright as a name and is catchy 

function Navbar() {
  const {auth, userData} = useContext(AuthContext);
  const User_profile = (token1) =>{
    if (token1.token !== null){
      //console.log("token1: ", token1);
      //console.log("userData: " ,userData);
      return(
        <Link to={"/profile/" + token1.token }>
                <img src={userData["profile_picture"]} alt="" />
        </Link>
      )
    }
    else{
      return(
        <Link to={"/login" }>
          <img src={placeholder} alt="" />
        </Link>
      )
    }
  }


  return (
    <div className="navBar"> 

      <div className="left"> 
        <Link to="/home" style={{ textDecoration: "none"}}> 
        <span> Ode</span>
        </Link>

        <div className="search" > 
          <FaSearch />
          <input type="text" placeholder="Search..." />
        </div>
      </div>


      <div className="middle"> 
        <IoHomeSharp />
        <IoMusicalNote /> 
        {/* this is for the events page  */}
      </div>


      <div className="right"> 
        <Link to="/chat">
          <BiSolidMessageSquare /> 
        </Link>
        <IoMdNotifications />
        <div className="user">
        <User_profile token={auth.token}/>
          {/* <span> Dummy User</span> */}
        </div>
      </div>


    </div>
  
  );
}



export default Navbar;
