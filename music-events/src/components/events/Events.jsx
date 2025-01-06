import { useState, useEffect } from "react";
import axios from "axios";
import "./Events.scss";
import Hahn from "../../assets/Hahn_2.jpg"
import HahnProfile from "../../assets/HahnProfile.jpeg"
import Janine from "../../assets/Janine_Jansen.jpeg"
import Vilde from "../../assets/Vilde_Frang.jpg"
import Joshua from "../../assets/Joshua_Bell.jpg"
import Nikola from "../../assets/Nicola.jpg"

// going to hard code this in for now, but API should be able to handle this in the future 


// Anna- commenting out the old code in case we need it again
const Events = () => {

// temporary dummy data, link this up to the API
// it goes without saying, that if we do not have 5 event videos, or the filtering doens't have that
// make this dynamic and show them less events stories
// maybe add buttons to swiping so right swipe = more about the event, left is not interested




const events = [
    {
        id: 1, // unique id for organiser
        username: "Hilary Hahn", // name of the event organiser or company
        img: Hahn,

    },
    {
        id: 2, // unique id for player
        username: "Janine Jansen",
        img: Janine,

    },
    {
        id: 3, // unique id for player
        username: "Vilde Frang",
        img: Vilde,

    },
    {
        id: 4, // unique id for player
        username: "Joshua Bell",
        img: Joshua,

    },
    {
        id: 5, // unique id for player
        username: "Nikola",
        img: Nikola,

    },

]



return (
    <div className="Events">
        {events.map(event =>(
            <div className="event" key={event.id}>
                <img src={event.img} alt="" />
                <span>{event.username}</span>

            </div>
        ))}
    </div>
) 


}
//Anna new start
//needs better styling
//if a user doesnt have a profile it kinda breaks but I will try to fix that later on
//right now picture shown is picture of user since adding a picture to an event is not working yet
// const EventCard = ({ event, onClick }) => (
//     <div className="event-card" onClick={onClick}>
//         {event.picture ? (
//             <img src={event.picture} alt="" className="event-image" />
//         ) : (
//             <div className="placeholder-image">No Image Available</div>
//         )}
//         <div className="event-info">
//             <h3>{event.admin || 'Unknown Organization'}</h3>
//             <div className="genres">
//                 {Array.isArray(event.genres) && event.genres.map((genre, index) => (
//                     <span key={index} className="genre-tag">{genre}</span>
//                 ))}
//             </div>
//         </div>
//     </div>
// );

// const EventDetails = ({ event, onClose }) => (
//     <div className="event-details-overlay" onClick={onClose}>
//         <div className="event-details" onClick={e => e.stopPropagation()}>
//             <button className="close-btn" onClick={onClose}>×</button>
//             {event.picture ? (
//                 <img src={event.picture} alt="" className="full-image" />
//             ) : (
//                 <div className="placeholder-image">No Image Available</div>
//             )}
//             <h2>{event.admin || 'Unknown Organization'}</h2>
//             <div className="genres">
//                 {Array.isArray(event.genres) && event.genres.map((genre, index) => (
//                     <span key={index} className="genre-tag">{genre}</span>
//                 ))}
//             </div>
//             <p className="description">{event.information || 'No description available'}</p>
//         </div>
//     </div>
// );

// const Events = () => {
//     const [events, setEvents] = useState([]);
//     const [selectedEvent, setSelectedEvent] = useState(null);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/event/all');
//                 setEvents(response.data.data || []);
//             } catch (error) {
//                 console.error("Failed to fetch events:", error);
//             }
//         };
//         fetchEvents();
//     }, []);

//     return (
//         <div className="events-container">
//             <div className="events-grid">
//                 {events.map(event => (
//                     <EventCard
//                         key={event.id}
//                         event={event}
//                         onClick={() => setSelectedEvent(event)}
//                     />
//                 ))}
//             </div>
//             {selectedEvent && (
//                 <EventDetails
//                     event={selectedEvent}
//                     onClose={() => setSelectedEvent(null)}
//                 />
//             )}
//         </div>
//     );
// };

//Anna new end

export default Events;
