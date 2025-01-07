import axios from "axios";
import { useNavigate } from "react-router-dom";

export default async function HandleLogin(e, navigate, login_auth, set_user_detail) {
    const userPath = process.env.REACT_APP_BACKEND_ENDPOINT + 'user/login';
    const adminPath = process.env.REACT_APP_BACKEND_ENDPOINT + 'admin/login';
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    let data = {};
    for (var [key, value] of formData.entries()) {
        data[key] = value;
    }

    try {
        // Try user login first
        const userResponse = await axios.post(userPath, data);
        if (userResponse.data.status === "success") {
            login_auth(data["username"], "user");
            set_user_detail(userResponse.data.user_id,  userResponse.data.data ,"user" );
            alert("Success!");
            navigate("/home");
            return;
        }
        else{
            // If user login fails, try admin login
            // transferring username to organisation
            const data_org = {
                "organisation" : data["username"],
                "password" : data["password"]
            }
            const adminResponse = await axios.post(adminPath, data_org);
            console.log(adminResponse.data);
            console.log(data_org);
            if (adminResponse.data.status === "success") {
                login_auth(data["username"], "admin");
                set_user_detail(adminResponse.data.user_id, adminResponse.data.data, "admin");
                alert("Admin login successful!");
                navigate("/home");
                return;
            }
            else{

            }
        }

        

        // If both fail, show error
        alert("Invalid credentials");
    } catch(error) {
        console.error("Error: ", error.message);
        alert("Login failed. Please check your credentials.");
    }
}