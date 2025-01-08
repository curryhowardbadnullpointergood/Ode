import React, { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../authentication/AuthContext";
import HandleCreateEvent from '../../apiFunctions/HandleCreateEvent';
import "./organisation.scss"

/* 
So we need organisation name input, this is done in the login stage I guess, need to tweak it for organisation 
support i guess, shouldn't be too bad 
need an add event dic, where organiser can add an event, 
so this takes in, text description, image, possibly video not compulsory though, 
genre, location, etc. text input field, gets uploaded to the backend 
doesn't need to look pretty, so will code this quick. 


link submit buttont to backend function
*/

const Organisation = () => {
    const navigate = useNavigate();
    const { auth, userData } = useContext(AuthContext);
    const currentUser = userData.username; // Get username from userData instead of localStorage

    useEffect(() => {
        if (auth.account_type !== "admin") {
            console.log("Not an admin, redirecting. Account type:", auth.account_type);
            navigate('/');
        }
    }, [auth.account_type, navigate]);

    return (
        <div className="organisation">
            <h1> ORGANISATION ACCOUNT </h1>
            <form onSubmit={(e) => HandleCreateEvent(e, navigate)}>
                <input type="text" name="name" placeholder="Event name" />
                <span> Event name </span>
                <input type="hidden" name="admin" value={currentUser} />

                <input type="text" name="information" placeholder="Event description" />
                <span> Event description</span>

                <input type="file" name="picture" accept="image/*" />
                <span> Upload event image! </span>

                <input type="text" name="location" placeholder="Location" />
                <span> Upload Location! </span>

                <input type="text" name="genres" placeholder="Music genre!" />
                <span> Upload Genre! </span>

                <input type="text" name="date" placeholder="Date" />
                <span> Date of the event. </span>

                <input type="text" name="start_time" placeholder="Start time" />
                <span> Time the event starts. </span>

                <input type="text" name="end_time" placeholder="End time" />
                <span> Time the event ends. </span>

                <input type="number" name="ticket_price" placeholder="Ticket price" />  {/* Changed type to number */}
                <span> Price of tickets. </span>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default Organisation