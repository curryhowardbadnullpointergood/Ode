import axios from "axios";
import {storage} from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default async function HandleProfileUpdate(e,username,type, {interest, file}={}) {
        // Prevent the browser from reloading the page
        let userData = {};
        const path = 'http://localhost:8080/user/create_profile';
        const path_image_upload = 'http://localhost:8080/user/image';
        // for the download url
        let imgURL = "";
        e.preventDefault();
        //console.log("handleProfileUpdate was called!");
        let data = {"username" : username};
        // Read the form data, the following have two different way of handling data as the selection of interests 
        // is different from using form input so we have to handle it differently : Lucas
        if (type === "name" || type === "bio"){ // perform form data handling
            const form = e.target;
            const formData = new FormData(form);    
            for (var [key, value] of formData.entries()) { 
                data[key] = value;
            }
        }
        else{ // perform the interest button thing
            console.log("interest: ",interest);
            data["interests"] = interest;
        }
        try {
            if (type === "pic") {
                //console.log("pic");
                const filename = 'profile_pic/' + username + "-"+ file.name ;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, file);

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
                        imgURL = downloadURL;
                        data["profile_picture"] = imgURL;
                        // api call through axios to update firestore
                        //console.log("data to api: ", data);
                        const response = await axios.post(path, data);
                        if (response.data.status === "success") {
                            //console.log(response.data);
                            alert("Update successful!");
                        } else {
                            alert(response.data.error);
                        }
                    }
                );

            }
            else{
                // api call through axios to update firestore
                console.log("data to api: ", data);

                const response = await axios.post(path, data);
                
                if (response.data.status === "success") {
                    console.log(response.data);
                    alert("Update successful!");
                } else {
                    alert(response.data.error);
                }
            }
            
        } catch (error) {
            console.error("Error: ", error.message);
            alert("An error occurred. Please try again.");
        }
    }
