import { useState, useEffect } from "react";
import axios from "axios";
import "./Events.scss";
import Hahn from "../../assets/Hahn.jpg"
import HahnProfile from "../../assets/HahnProfile.jpeg"

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
            username: "Hilary Hahn",
            img: Hahn,
        },
        {
            id: 3, // unique id for player
            username: "Hilary Hahn",
            img: Hahn,
        },
        {
            id: 4, // unique id for player
            username: "Hilary Hahn",
            img: Hahn,
        },
        {
            id: 5, // unique id for player
            username: "Hilary Hahn",
            img: Hahn,
        },
    ];

    return (
        <div className="Events">
            {events.map(event =>(
                <div className="event" key={event.id}>
                    <img src={event.img} alt="" />
                    <span>{event.username}</span>
                </div>
            ))}
        </div>
    );
};

export default Events;