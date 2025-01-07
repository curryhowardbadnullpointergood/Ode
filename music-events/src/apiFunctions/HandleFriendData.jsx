import axios from "axios";
import { useNavigate } from "react-router-dom";

export default async function HandleFriendData(username, friends, field, setProfilePics) {
    const userPath = process.env.REACT_APP_BACKEND_ENDPOINT + 'user/get_friend_data';
    let data = {
        "username" : username,
        "friends" : friends,
        "field" : field
    }

    try {
        // Try user login first
        const userResponse = await axios.post(userPath, data);
        if (userResponse.data.status === "success") {
            console.log(userResponse.data.data);
            setProfilePics(userResponse.data.data); // an array of image
            return userResponse.data.data;
        }
        else{
            console.log("retrieve friends data failed");
        }
    } catch(error) {
        console.error("Error: ", error.message);
    }
}