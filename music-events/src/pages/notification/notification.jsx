import "./notification.scss"
import Organisation_Image from "../../assets/org_image.jpg"
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../authentication/AuthContext";
import axios from "axios";

// id her is the id of the user, and we get the notifications of the user 
// from the database 
// make changes as needed to get this to work, I can't spell out how to code evey function figure it out make it work 


const Notification = () => {

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
        const uri = process.env.REACT_APP_BACKEND_ENDPOINT+"generate_notification/";

        const requestBody = {
            id: userId
        };

        try {
            const response = await axios.post(uri, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = response.data;
            console.log("Server response:", data);

            const fetchedNotifications = data.events || [];

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

export default Notification