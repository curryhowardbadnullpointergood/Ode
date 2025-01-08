import axios from "axios";
import {useEffect, useState, useContext} from "react";
import AuthContext from "../authentication/AuthContext";
export default async function HandleAdminInfo(id, setUserData,auth, userData,set_user_detail) {
    //const {auth, userData,set_user_detail } = useContext(AuthContext);
    const path = process.env.REACT_APP_BACKEND_ENDPOINT+'admin/view_admin';
    
        const fetchData = async() => {
            try{ 
                if (auth.account_type === "user"){
                    return "wrong type";
                }
                console.log("admin info");
                const response = await axios.post(path,{organisation : id} );
                const dataObject = response.data.data;
                if (response.data.status === "success"){
                    console.log("success");
                    console.log(dataObject["profile_picture"]);
                    const reply = {
                        "bio" : dataObject["bio"],
                        "organisation" : dataObject["organisation"],
                        "profile_picture" : dataObject["profile_picture"],
                        "events_created" : dataObject["events_created"],
                        "name" : dataObject["name"]
                    }
                    console.log(reply);
                    setUserData(reply);
                    if (auth.token === id){
                        set_user_detail( userData.id ,reply, auth.account_type); // change the login user info once the id (username) is the same
                    }
                    
                }
                else{
                    setUserData(response.data.error);
                }
            }
            catch(error){
                console.error("Error: ", error.message);
            }
        }
        fetchData();
    
}
