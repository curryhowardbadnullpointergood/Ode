import "./Eventposts.scss"
import anneSophieMutter from "../../assets/anne-sophie-mutter.jpg"
import Sophie from "../../assets/anne-sophie-mutter_profile.jpg"
import { EventPost } from "../eventpost/EventPost"
import {useEffect, useState} from "react";
import axios from 'axios';

const EventCard = ({ event, onClick }) => {
    // Helper function to safely get the image URL
    const getImageUrl = (picture) => {
        if (!picture) return null;
        if (typeof picture === 'string') return picture;
        if (picture.title) return picture.title;
        return null;
    };

    return (
        <div className="event-card" onClick={onClick}>
            {getImageUrl(event.picture) ? (
                <img
                    src={getImageUrl(event.picture)}
                    alt=""
                    className="event-image"
                />
            ) : (
                <div className="placeholder-image">No Image Available</div>
            )}
            <div className="event-info">
                <h3>{typeof event.admin === 'string' ? event.admin : 'Unknown Organization'}</h3>
                <div className="genres">
                    {Array.isArray(event.genres) && event.genres.map((genre, index) => (
                        <span key={index} className="genre-tag">
                            {typeof genre === 'string' ? genre : ''}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EventDetails = ({ event, onClose }) => {
    const getImageUrl = (picture) => {
        if (!picture) return null;
        if (typeof picture === 'string') return picture;
        if (picture.title) return picture.title;
        return null;
    };

    return (
        <div className="event-details-overlay" onClick={onClose}>
            <div className="event-details" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                {getImageUrl(event.picture) ? (
                    <img src={getImageUrl(event.picture)} alt="" className="full-image" />
                ) : (
                    <div className="placeholder-image">No Image Available</div>
                )}
                <h2>{event.name}</h2>
                <div className="genres">
                    {Array.isArray(event.genres) &&
                        event.genres.map((genre, index) => (
                            <span key={index} className="genre-tag">
                {typeof genre === 'string' ? genre : ''}
              </span>
                        ))}
                </div>
                <p className="description">{event.information}</p>
                <p>Location: {event.location}</p>
                <p>
                    Date: {event.date} | Start Time: {event.start_time} | End Time:{' '}
                    {event.end_time}
                </p>
                <p>Ticket Price: ${event.ticket_price}</p>
            </div>
        </div>
    );
};

export const EventPosts = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/event/all');
                //console.log("Event data:", JSON.stringify(response.data.data, null, 2));
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