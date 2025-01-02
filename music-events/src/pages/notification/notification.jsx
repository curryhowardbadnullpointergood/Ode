import "./notification.scss"
import Organisation_Image from "../../assets/org_image.jpg"
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../authentication/AuthContext";

// id her is the id of the user, and we get the notifications of the user 
// from the database 
// make changes as needed to get this to work, I can't spell out how to code evey function figure it out make it work 


const notification = () => {

    const { userData } = useContext(AuthContext);


    // this is temporary, make sure to make this dynamic in the future 
    const notification = [
        {
            id: 12, // this is the id of the user 
            name: "Concerto",// this is the name of the organisation organising the event 
            notification: " This should be an ai generated notification about the event in question: blah blah blah blah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blah ",
            image: Organisation_Image, // this should be organisation image query with name 

        }
    ]

    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        const id = userData.id;
        generateNotification(id);
    }, []);

    const generateNotification = async (userId) => {
        const uri = "http://localhost:8080/generate_notification";

        const requestBody = {
            id: userId
        };

        try {
            const response = await fetch(uri, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                return;
            }

            const data = await response.json();
            console.log("Server response:", data);

            // data.notifications could be an array of notifications
            // if your backend returns them differently, adjust accordingly
            const fetchedNotifications = data.events || [];

            // set them in state (this will replace any existing notifications)
            // or you might want to append them if that makes sense
            setNotifications(fetchedNotifications);
        } catch (error) {
            console.error("Error fetching notification:", error);
        }
    };

    return (
        <div className='notification'>

            {notifications.map(notifi => (
                <div className="organisation" key={notifi.id}>
                    <div className="info">
                        <img src={notifi.image} alt=""/>
                        <span> {notifi.name}</span>
                    </div>
                    <div className="text">
                        <p>{notifi.notification}</p>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default notification