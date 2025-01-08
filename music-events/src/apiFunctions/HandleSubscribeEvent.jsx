import axios from "axios";

export default async function HandleSubscribeEvent(userId, eventId) {
    console.log("1. HandleSubscribeEvent called with:", { userId, eventId });

    if (!userId) {
        throw new Error('User must be logged in');
    }

    const path = process.env.REACT_APP_BACKEND_ENDPOINT + 'event/follow';
    console.log("2. Subscribe endpoint:", path);

    try {
        console.log("3. Sending subscribe request with data:", {
            user_id: userId,
            event_id: eventId
        });

        const response = await axios.post(path, {
            user_id: userId,
            event_id: eventId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        console.log("4. Subscribe response:", response);

        if (response.data.status === "success") {
            return response.data;
        }
        throw new Error(response.data.error || 'Failed to subscribe to event');
    } catch (error) {
        console.error("5. Subscribe error:", error);
        if (error.response) {
            console.error("Server responded with:", error.response.status, error.response.data);
        }
        throw error;
    }
}