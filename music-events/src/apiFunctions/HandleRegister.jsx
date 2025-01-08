import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";

export default async function HandleRegister(e, navigate) {
    // Prevent the browser from reloading the page

    let flag = true;
    const path = process.env.REACT_APP_BACKEND_ENDPOINT + 'user/register_user';
    e.preventDefault();
    console.log("handleRegister was called!");

    // Read the form data
    const form = e.target;
    console.log("form: ", form);
    const formData = new FormData(form);
    let data = {};
    for (var [key, value] of formData.entries()) {
        console.log(key, value);
        data[key] = value;
    }

    console.log(JSON.stringify(data));

    try {
        const response = await axios.post(path, data);
        console.log("response: ", response);

        if (response.data.auth_url) {
            window.location.href = response.data.auth_url;
        }
    } catch (error) {
        console.error("Error: ", error.message);
        alert("Registration failed. Please try again.");
    }


}
