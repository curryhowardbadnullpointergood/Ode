import axios from "axios";
import { useNavigate } from "react-router-dom";
export default async function HandleLogin(e,navigate,login_auth, set_user_detail ) {
        

        let userData = {};
        const path = 'http://localhost:8080/user/login';
        // Prevent the browser from reloading the page
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
                login_auth(data["username"]);
                set_user_detail(response.data.data);
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
