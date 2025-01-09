import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../authentication/AuthContext";
import HandleSubscribeEvent from '../../apiFunctions/HandleSubscribeEvent';
import axios from 'axios';
import "./Eventposts.scss";

const EventCard = ({ event, onClick }) => {
    const getImageUrl = (picture) => {
        if (!picture) return null;
        if (typeof picture === 'string') return picture;
        if (picture.title) return picture.title;
        return null;
    };

    return (
        <div id={event.name} className="event-card" onClick={onClick}>
            <div className="image-container">
                {getImageUrl(event.picture) ? (
                    <img
                        src={getImageUrl(event.picture)}
                        alt=""
                        className="event-image w-full h-48 object-cover"
                    />
                ) : (
                    <div className="placeholder-image h-48">No Image Available</div>
                )}
            </div>
            <div className="event-info">
                <h3>{event.name || 'Untitled Event'}</h3>
                <div className="admin">
                    <span className="admin-tag">
                        {typeof event.admin === 'string' ? event.admin : 'Unknown Organization'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const EventDetails = ({ event, onClose, userId,auth }) => {
    const [isInterested, setIsInterested] = useState(event.is_interested || false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInterested = async () => {
        if (!userId) {
            alert('Please log in to show interest in events');
            return;
        }

        setIsLoading(true);
        try {
            const response = await HandleSubscribeEvent(userId, event.id);
            setIsInterested(true);
            alert('Successfully added to your events!');
        } catch (error) {
            console.error('Error subscribing to event:', error);
            alert(error.response?.data?.error || 'Failed to subscribe to event');
        } finally {
            setIsLoading(false);
        }
    };

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
                <h2>{event.name || 'Event Details'}</h2>
                <div className="image-container max-w-2xl mx-auto">
                    {getImageUrl(event.picture) ? (
                        <img
                            src={getImageUrl(event.picture)}
                            alt=""
                            className="full-image w-full h-64 object-cover"
                        />
                    ) : (
                        <div className="placeholder-image h-64">No Image Available</div>
                    )}
                </div>
                <p><strong>Organizer:</strong> {event.admin}</p>
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
                <p>Ticket Price: {event.ticket_price}£</p>

                {auth.account_type === "user" && <button
                    onClick={handleInterested}
                    disabled={isLoading || isInterested}
                    className={`mt-4 px-6 py-2 rounded ${
                        isInterested
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isInterested ? 'Interested!' : isLoading ? 'Processing...' : 'Interested'}
                </button>}
            </div>
        </div>
    );
};

export const EventPosts = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { auth, userData } = useContext(AuthContext);

    useEffect(() => {
        const fetchEvents = async () => {
            const path = `${process.env.REACT_APP_BACKEND_ENDPOINT}event/all?user_id=${userData.id}`
            try {
                const response = await axios.get(path);
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
                    userId={userData?.id}
                    auth = {auth}
                />
            )}
        </div>
    );
};

export default EventPosts;