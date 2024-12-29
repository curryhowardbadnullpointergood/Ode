import axios from "axios";
import { useNavigate } from "react-router-dom";
export default async function HandleProfileUpdate(e,navigate ) {
        // Prevent the browser from reloading the page
        let userData = {};
        const path = 'http://localhost:8080/user/create_profile';
        e.preventDefault();
        console.log("handleRegister was called!");
        
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        let data = {};
        for (var [key, value] of formData.entries()) { 
            console.log(key, value);
            data[key] = value;
        }
        console.log(JSON.stringify(data));

        try{
            const response = await axios.post(path,data );
            console.log("response: ", response);
            if (response.data.status === "success"){
                alert("success!");
                navigate("/home");
            }
            else{
                alert(response.data.error);
            }
        }
        catch(error){
            console.error("Error: ", error.message);
        }
    

        
      }
