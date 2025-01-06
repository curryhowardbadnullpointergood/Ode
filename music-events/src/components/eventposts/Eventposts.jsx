
import "./Eventposts.scss"
import anneSophieMutter from "../../assets/anne-sophie-mutter.jpg"
import Sophie from "../../assets/anne-sophie-mutter_profile.jpg"
import { EventPost } from "../eventpost/EventPost"
import {useEffect, useState} from "react";
import axios from 'axios';
export const EventPosts = () => {

//Anna new start
//needs better styling
    const EventCard = ({ event, onClick }) => (
        <div className="event-card" onClick={onClick}>
            {event.picture ? (
                <img src={event.picture} alt="" className="event-image" />
            ) : (
                <div className="placeholder-image">No Image Available</div>
            )}
            <div className="event-info">
                <h3>{event.admin || 'Unknown Organization'}</h3>
                <div className="genres">
                    {Array.isArray(event.genres) && event.genres.map((genre, index) => (
                        <span key={index} className="genre-tag">{genre}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const EventDetails = ({ event, onClose }) => (
        <div className="event-details-overlay" onClick={onClose}>
            <div className="event-details" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                {event.picture ? (
                    <img src={event.picture} alt="" className="full-image" />
                ) : (
                    <div className="placeholder-image">No Image Available</div>
                )}
                <h2>{event.admin || 'Unknown Organization'}</h2>
                <div className="genres">
                    {Array.isArray(event.genres) && event.genres.map((genre, index) => (
                        <span key={index} className="genre-tag">{genre}</span>
                    ))}
                </div>
                <p className="description">{event.information || 'No description available'}</p>
            </div>
        </div>
    );

    const Events = () => {
        const [events, setEvents] = useState([]);
        const [selectedEvent, setSelectedEvent] = useState(null);

        useEffect(() => {
            const fetchEvents = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/event/all');
                    setEvents(response.data.data || []);
                } catch (error) {
                    console.error("Failed to fetch events:", error);
                }
            };
            fetchEvents();
        }, []);

        return (
            <div className="events-container">
                <div className="events-grid">
                    {events.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => setSelectedEvent(event)}
                        />
                    ))}
                </div>
                {selectedEvent && (
                    <EventDetails
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </div>
        );
    };

//Anna new end

    /*
        // temp
        // should be handled by API in the future 
        const eventposts = [
            {
                id: 1, // this is organiser id links back to profile 
                name: "ClassicalTheatre", // name of organisation 
                picture: Sophie, // picture of organisation logo
                description: "' listen to the best solo violin concerto interpretation of sibelius '", // description of the event  
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
*/
}
