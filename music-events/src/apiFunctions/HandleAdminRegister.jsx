import axios from "axios";

export default async function HandleAdminRegister(e, navigate) {
    e.preventDefault();
    const path = process.env.BACKEND_ENDPOINT+'user/register_admin';

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
        if (response.data.status === "success") {
            alert("Admin registered successfully!");
            navigate("/login");
        } else {
            alert(response.data.error);
        }
    } catch(error) {
        console.error("Error: ", error.message);
    }
}