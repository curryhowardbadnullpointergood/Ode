import "./home.scss"
import Event from "../../components/events/Events"
import { EventPosts } from "../../components/eventposts/Eventposts"

const Home = () => {
    return(
        <div className="home"> 
            <Event/> 
            <EventPosts/>
        </div>
    )
}


export default Home 