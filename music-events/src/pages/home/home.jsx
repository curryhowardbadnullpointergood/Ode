import "./home.scss"
import Event from "../../components/events/Events"
import { EventPosts } from "../../components/eventposts/Eventposts"
import AuthContext from "../../authentication/AuthContext";
import {useContext, useEffect} from "react";


const Home = () => {
    const {auth, userData} = useContext(AuthContext); 
    console.log("userData: ", userData);
    console.log("auth: ", auth);

    


    useEffect(() => {
      const hash = window.location.hash.slice(1); // Remove the '#' character from the hash
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, []);

    return(
        <div className="home"> 
            <Event/> 
            <EventPosts/>
        </div>
    )
}


export default Home 