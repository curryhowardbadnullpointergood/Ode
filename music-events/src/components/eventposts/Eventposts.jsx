
import "./Eventposts.scss"
import anneSophieMutter from "../../assets/anne-sophie-mutter.jpg"
import { EventPost } from "../eventpost/EventPost"

export const EventPosts = () => {

        // temp
        // should be handled by API in the future 
        const eventposts = [
            {
                id: 1, // this is organiser id links back to profile 
                name: "ClassicalTheatre", // name of organisation 
                picture: anneSophieMutter, // picture of organisation logo
                description: "listen to the best solo violin concerto interpretation on sibelius", // description of the event  
                img: anneSophieMutter, // picture of the artist or poster 
                postId: 3, // organisers can have multiple posts, put in databse, and this is the unique id for that 
                
            }   


        ]

  return (
    <div className="eventposts">
        {eventposts.map(eventpost=>(
            <EventPost eventpost={eventpost} key={eventpost.id}/> 
        ))}
    </div>
  )
}
