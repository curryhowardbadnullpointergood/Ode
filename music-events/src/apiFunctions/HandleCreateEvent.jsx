import axios from "axios";

export default async function HandleCreateEvent(e, navigate) {
    e.preventDefault();
    const path = process.env.BACKEND_ENDPOINT+'event/create';
    console.log("handleCreateEvent was called!");

    const form = e.target;
    console.log("form: ", form);
    const formData = new FormData(form);
    let data = {
        users: [],
        genres: []
    };

    for (var [key, value] of formData.entries()) {
        console.log(key, value);
        if (key === 'picture' && value instanceof File) {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(value);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
            data[key] = base64;
        } else if (key === 'genres') {
            data[key] = value.split(',').map(genre => genre.trim());
        } else {
            data[key] = value;
        }
    }

    try {
        const response = await axios.post(path, data);
        console.log("response: ", response);
        if (response.data.status === "success") {
            alert(response.data.message);
            navigate("/events");
        } else {
            alert(response.data.error);
        }
    } catch (error) {
        console.error("Error: ", error.message);
        alert("Failed to create event. Please try again.");
    }
}