import axios from "axios";
import { useNavigate } from "react-router-dom";

export default async function HandleFriendLocation( friends, setPos) {
    const userPath = process.env.REACT_APP_BACKEND_ENDPOINT + '/get_friend_location';
    let data = {
        "friends" : friends // list of friends
    }

    try {
        // Try user login first
        const userResponse = await axios.post(userPath, data);
        if (userResponse.data.status === "success") {
            console.log(userResponse.data.data);
            setPos(userResponse.data.data); // an array of location
            return userResponse.data.data;
        }
        else{
            console.log("retrieve friends location failed");
        }
    } catch(error) {
        console.error("Error: ", error.message);
    }
}