import axios from "axios";
import {storage} from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default async function HandleCreateEvent(data, navigate) {
    const path = `${process.env.REACT_APP_BACKEND_ENDPOINT}event/create`;
    console.log("1. HandleCreateEvent was called!");
    console.log("2. Using endpoint:", path);

    console.log("4. Final data being sent:", data);
    try {
        if (data["picture"]!== undefined){ // send picture to firestore, data["picture"] -> the img file
            //console.log("pic");
            const filename = 'event_pic/' + data["name"] + "-"+ data["picture"].name ;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, data["picture"]);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Update progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    //setProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert("Failed to upload image. Please try again.");
                },
                async () => {
                    // Get download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    //console.log("downloadURL: ", downloadURL);
                    let imgURL = downloadURL;
                    data["picture"] = imgURL;
                    // api call through axios to update firestore
                    console.log("data to api: ", data);
                    const response = await axios.post(path, data);
                    if (response.data.status === "success") {
                        //console.log(response.data);
                        alert("Update successful!");
                        console.log(response.data.message);
                        navigate("/home");
                    } else {
                        alert(response.data.error);
                    }
                }
            );
        }
        else{ // update with no image
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
        }
    } catch (error) {
        console.error("7. Error details:", error);
        console.error("8. Error response:", error.response?.data || error.message);
        alert("Failed to create event. Please try again.");
    }
}