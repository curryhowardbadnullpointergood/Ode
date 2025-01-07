import {Link,useNavigate } from "react-router-dom";
import "./navBar.scss"
import {useContext} from "react";

import hahn from "../../assets/Hahn.jpg";
import placeholder from "../../assets/placeholder.jpg"
import AuthContext from "../../authentication/AuthContext";
import Translator from "../../pages/translator/translator";

import { MdEventAvailable } from "react-icons/md";//Anna

// literally the basic navbar example for the documentation, should really change in the future 

// importing the icons, maybe in the future we can have someone redo the icon design in illustrator
// is that overkill? ugh maybe 
import { IoHomeSharp } from "react-icons/io5";
import { IoMusicalNote } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io"; // this is for the notifications of the event and if someone tagged the user or well discord tag / instagram at 
import { BiSolidMessageSquare } from "react-icons/bi"; // this is for messages in the group chats/ direct messages between users etc 
import { FaEarthAfrica } from "react-icons/fa6";// this is for translation of the page 

// for now the name of the app is Ode, sounds allright as a name and is catchy 

function Navbar() {
  const navigate = useNavigate();
  const {auth, userData, searchQuery, setSearchQuery} = useContext(AuthContext);
  //Anna
  //const isAdmin = userData?.isAdmin || false;

  const User_profile = (token1, image) =>{
    if (token1.token !== null){
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update the search query state
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    navigate("/search");
  }

  const handleTranslate = () => {
    navigate("/translate");
  };


  return (
    <div className="navBar"> 

            <div className="left">
                <Link to="/home" style={{textDecoration: "none"}}>
                    <span> Ode</span>
                </Link>

                <div className="search">
                    <FaSearch/>
                    <form onSubmit={handleSubmit}>
                      <input type="text" value={searchQuery}
                        onChange={handleSearch} placeholder="Search..."/>
                    </form>
                </div>
            </div>


            <div className="middle">
                <IoHomeSharp/>
                <IoMusicalNote/>
                {/* Anna - adding icon for creating events */}
                {/* {isAdmin && (
                    <Link to={`/organisation/${userData.id}`}>
                        <MdEventAvailable className="admin-icon" title="Create Event"/>
                    </Link>
                )} */}
                <Link to={`/organisation/${userData.id}`}>
                    <MdEventAvailable className="admin-icon" title="Create Event"/>
                </Link>
            </div>


            <div className="right">
                <Link to={`/map`}>
                  <FaMapMarkerAlt/>
                </Link>
                <Link to="/chat">
                    <BiSolidMessageSquare/>
                </Link>
                <Link to="/notification">
                    <IoMdNotifications/>
                </Link>
                
                <div className="user">
                    <User_profile token={auth.token} image={userData.profile_picture}/>
                    {/* <span> Dummy User</span> */}
                </div>
                <Translator />
            </div>


        </div>

    );
}


export default Navbar;
