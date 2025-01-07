import axios from "axios";
import { useNavigate } from "react-router-dom";
export default async function HandleFollowUser(username, user_to_add) {
        // Prevent the browser from reloading the page
        const path = process.env.REACT_APP_BACKEND_ENDPOINT+'user/add_friend';
        console.log("HandleFollowUser was called!");


        // Read the form data
        let data_1 = {
            "username" : username,
            "friends" : user_to_add};
        let data_2 = {
            "username" : user_to_add,
            "friends" : username
        }

        try{
            const response_1 = await axios.post(path,data_1 );
            const response_2 = await axios.post(path,data_2 );
            console.log("response_1: ", response_1);
            console.log("response_2: ", response_2);
            if (response_1.data.status === "success" && response_2.data.status === "success"){
                alert("successfully followed!");
            }
            else{
                alert("operation failed");
                console.log(response_1.data.error);
                console.log(response_2.data.error);
            }
        }
        catch(error){
            console.error("Error: ", error.message);
        } 
      }
