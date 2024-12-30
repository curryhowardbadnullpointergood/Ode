import axios from "axios";
import { useNavigate } from "react-router-dom";
export default async function HandleProfileUpdate(e,username, settingMethod,type, interest = null ) {
        // Prevent the browser from reloading the page
        let userData = {};
        const path = 'http://localhost:8080/user/create_profile';
        const path_image_upload = 'http://localhost:8080/user/image';
        e.preventDefault();
        //console.log("handleProfileUpdate was called!");
        let data = {"username" : username};
        // Read the form data, the following have two different way of handling data as the selection of interests 
        // is different from using form input so we have to handle it differently : Lucas
        if (interest === null){ // perform form data handling
            const form = e.target;
            const formData = new FormData(form);    
            //console.log("username: ",username);
            for (var [key, value] of formData.entries()) { 
                //console.log(key, value);
                data[key] = value;
            }
            //console.log(JSON.stringify(data));
        }
        else{ // perform the interest button thing

        }

        

        try{
            if (type === "pic"){
                const upload_img = await axios.post(path_image_upload,data["profile_picture"] );
                if (response.data.status === "success"){
                    console.log("image upload success");
                }
                else{
                    console.log("image upload failed");
                }
            }
            const response = await axios.post(path,data );
            //console.log("response: ", response);
            if (response.data.status === "success"){
                alert("update success!");
            }
            else{
                alert(response.data.error);
            }
        }
        catch(error){
            console.error("Error: ", error.message);
        }
    

        
      }
