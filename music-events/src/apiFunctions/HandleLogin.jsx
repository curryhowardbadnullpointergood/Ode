import axios from "axios";
import { useNavigate } from "react-router-dom";
export default async function HandleLogin(e,navigate,login_auth, set_user_detail ) {
        

        let userData = {};
        const path = process.env.BACKEND_ENDPOINT+'user/login';
        // Prevent the browser from reloading the page
        e.preventDefault();
        console.log("handleRegister was called!");
        
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        let data = {};
        for (var [key, value] of formData.entries()) { 
            data[key] = value;
        }

        try{
            const response = await axios.post(path,data );
            //console.log("response: ", response);
            if (response.data.status === "success"){
                login_auth(data["username"]);
                //set_user_detail(response.data.data, response.data.user_id);
                //console.log("response.data.data: ",response.data.data);
                set_user_detail(response.data.id, response.data.data);
                alert("success!");
                navigate("/home");
            }
            else {
                alert(response.data.error);
            }
            //anna - added admin login
            //else{
              //  const adminResponse = await axios.post('http://localhost:8080/admins/login', data);
              //  if (adminResponse.data.status === "success") {
               //     login_auth(data["admin_name"]);
               //     set_user_detail({...adminResponse.data.data, isAdmin: true});
              //      alert("Admin login successful!");
              //  } else {
              //      alert(response.data.error);
              //  }
            //}
        }
        catch(error){
            console.error("Error: ", error.message);
        }
    

        
      }
