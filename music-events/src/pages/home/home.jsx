import "./home.scss"
import Event from "../../components/events/Events"
import { EventPosts } from "../../components/eventposts/Eventposts"
import AuthContext from "../../authentication/AuthContext";
import {useContext} from "react";


const Home = () => {
    const {auth, userData} = useContext(AuthContext); 
    console.log("userData: ", userData);
    console.log("auth: ", auth);
    return(
        <div className="home"> 
            <Event/> 
            <EventPosts/>
        </div>
    )
}


export default Home 