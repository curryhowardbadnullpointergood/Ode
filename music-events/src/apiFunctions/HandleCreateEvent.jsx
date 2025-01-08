import axios from "axios";

export default async function HandleCreateEvent(e, navigate) {
    e.preventDefault();
    const path = `${process.env.REACT_APP_BACKEND_ENDPOINT}event/create`;
    console.log("1. HandleCreateEvent was called!");
    console.log("2. Using endpoint:", path);

    const form = e.target;
    const formData = new FormData(form);
    let data = {
        users: [],
        genres: []
    };

    for (var [key, value] of formData.entries()) {
        console.log(`3. Processing form field - ${key}:`, value);
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

    console.log("4. Final data being sent:", data);

    try {
        console.log("5. Attempting POST request...");
        const response = await axios.post(path, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("6. Response:", response);

        if (response.data.status === "success") {
            alert(response.data.message);
            navigate("/home");
        } else {
            alert(response.data.error);
        }
    } catch (error) {
        console.error("7. Error details:", error);
        console.error("8. Error response:", error.response?.data || error.message);
        alert("Failed to create event. Please try again.");
    }
}