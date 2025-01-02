import {Link} from "react-router-dom";
import "./navBar.scss"
import {useContext} from "react";

import hahn from "../../assets/Hahn.jpg"
import AuthContext from "../../authentication/AuthContext";

// literally the basic navbar example for the documentation, should really change in the future 

// importing the icons, maybe in the future we can have someone redo the icon design in illustrator
// is that overkill? ugh maybe 
import {IoHomeSharp} from "react-icons/io5";
import {IoMusicalNote} from "react-icons/io5";
import {FaSearch} from "react-icons/fa";
import {IoMdNotifications} from "react-icons/io"; // this is for the notifications of the event and if someone tagged the user or well discord tag / instagram at
import {BiSolidMessageSquare} from "react-icons/bi"; // this is for messages in the group chats/ direct messages between users etc


const User_profile = (token1) => {
    //console.log("user_profile function called");
    //console.log("token: ", token1.token);
    if (token1.token !== null) {
        return (
            <Link to={"/profile/" + token1.token}>
                <img src={hahn} alt=""/>
            </Link>
        )
    } else {
        return (
            <Link to={"/login"}>
                <img src={hahn} alt=""/>
            </Link>
        )
    }
}

// for now the name of the app is Ode, sounds allright as a name and is catchy 

function Navbar() {
    const {auth} = useContext(AuthContext);
    //console.log("auth.token: ", auth.token);
    return (
        <div className="navBar">

            <div className="left">
                <Link to="/home" style={{textDecoration: "none"}}>
                    <span> Ode</span>
                </Link>

                <div className="search">
                    <FaSearch/>
                    <input type="text" placeholder="Search..."/>
                </div>
            </div>


            <div className="middle">
                <IoHomeSharp/>
                <IoMusicalNote/>
                {/* this is for the events page  */}
            </div>


            <div className="right">
                <Link to="/chat">
                    <BiSolidMessageSquare/>
                </Link>
                <Link to="/notification">
                    <IoMdNotifications/>
                </Link>
                <div className="user">
                    <User_profile token={auth.token}/>
                    {/* <span> Dummy User</span> */}
                </div>
            </div>


        </div>

    );
}


export default Navbar;
