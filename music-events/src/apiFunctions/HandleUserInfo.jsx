import axios from "axios";
import {useEffect, useState, useContext} from "react";
import AuthContext from "../authentication/AuthContext";
export default async function HandleUserInfo(id, setUserData) {
    const {auth, userData,set_user_detail } = useContext(AuthContext);
    const path = process.env.BACKEND_ENDPOINT+'user/view_user';
    const reply = {  
        username : "",
        name: "",
        profile_picture: "",
        interests: [],
        events_interested : [],
        friends : [],
        bio : "testing"
      };
    useEffect (() => {
        const fetchData = async() => {
            try{ 
                const response = await axios.post(path,{username : id} );
                //console.log("response: ", response);
                //console.log("response.data.data: ", response.data.data);
                const dataObject = response.data.data;
                if (response.data.status === "success"){
                    for (const key of Object.keys(dataObject)){
                        if (key in reply){
                            //console.log("hi");
                            reply[key] = dataObject[key];
                        }
                    }
                    console.log(reply);
                    setUserData(reply);
                    if (auth.token === id){
                        set_user_detail(reply); // change the login user info once the id (username) is the same
                    }
                    
                }
                else{
                    setUserData(response.data.error);
                    
                }
            }
            catch(error){
                //console.error("Error: ", error.message);
            }
        }
        fetchData();
    },[id])
}
