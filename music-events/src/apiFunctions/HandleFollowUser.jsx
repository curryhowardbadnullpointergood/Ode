import axios from "axios";
import { useNavigate } from "react-router-dom";
export default async function HandleFollowUser(username,friend_list, user_to_add) {
        // Prevent the browser from reloading the page

        let flag = true;
        const path = process.env.REACT_APP_BACKEND_ENDPOINT+'user/create_profile';
        console.log("HandleFollowUser was called!");
        console.log("username: ", username);
        console.log("friend_list: ", friend_list);
        console.log("user_to_add: ", user_to_add);
        let list = friend_list;
        list.push(user_to_add);
        // Read the form data
        let data = {
            "username" : username,
            "friend" : friend_list};
    

        try{
            const response = await axios.post(path,data );
            console.log("response: ", response);
            if (response.data.status === "success"){
                alert("successfully followed!");
            }
            else{
                alert(response.data.error);
            }
        }
        catch(error){
            console.error("Error: ", error.message);
        }

        
      }
