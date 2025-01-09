import axios from "axios";

export default async function HandleAdminRegister(e, navigate) {
    e.preventDefault();
    const path = process.env.REACT_APP_BACKEND_ENDPOINT+'organiser/register_admin';


    const form = e.target;
    const formData = new FormData(form);
    let data = {};
    for (var [key, value] of formData.entries()) {
        console.log(key, value);
        data[key] = value;
    }

    try {
        const response = await axios.post(path, data);
        console.log("response: ", response);

        if (response.data.error) {
            alert(`Error: ${response.data.error}`);
        } else if (response.data.auth_url) {
            // If there's an auth_url, redirect to it
            window.location.href = response.data.auth_url;
        }
    } catch(error) {
        console.error("Error: ", error.message);
        alert("Registration failed. Please try again.");
    }
}