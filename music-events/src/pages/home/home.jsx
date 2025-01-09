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
        const scrollToHash = () => {
          const hash = window.location.hash; // Get the hash from the URL
          if (hash) {
            const escapedHash = CSS.escape(hash.slice(1)); // Remove '#' and escape the ID
            const targetElement = document.querySelector(`#${escapedHash}`);
            if (targetElement) {
              // Smoothly scroll to the element
              window.scrollTo({
                top: targetElement.offsetTop, // Calculate the vertical offset of the element
                behavior: 'smooth', // Enable smooth scrolling
              });
            }
          }
        };
    
        scrollToHash(); // Run on page load
      }, []); // Run only once on mount

    return(
        <div className="home"> 
            <Event/> 
            <EventPosts/>
        </div>
    )
}


export default Home 