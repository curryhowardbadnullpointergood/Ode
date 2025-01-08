import axios from "axios";
import {useEffect, useState, useContext} from "react";
import AuthContext from "../authentication/AuthContext";
export default async function HandleUserInfo(id,setUserData_handle,auth, userData,set_user_detail ) {
    //const {auth, userData,set_user_detail } = useContext(AuthContext);
    const path = process.env.REACT_APP_BACKEND_ENDPOINT+'user/view_user';
    const reply = {  
        username : "",
        name: "",
        profile_picture: "",
        interests: [],
        events_interested : [],
        friends : [],
        bio : "testing"
      };
    
    console.log("id: ",id);
    const FetchData = async() => {
        
        try{ 
            
            if (auth.account_type === "admin"){
                setUserData_handle("wrong type");
                return "wrong type";
            }
            const response = await axios.post(path,{username : id} );
            const dataObject = response.data.data;
            if (response.data.status === "success"){
                for (const key of Object.keys(dataObject)){
                    if (key in reply){
                        //console.log("hi");
                        reply[key] = dataObject[key];
                    }
                }
                //console.log(reply);
                setUserData_handle(reply);
                if (auth.token === id){
                    set_user_detail( userData.id ,reply, auth.account_type); // change the login user info once the id (username) is the same
                }
                return(reply)
                
            }
            else{
                setUserData_handle(response.data.error);
                return(response.data.error)
            }
        }
        catch(error){
            console.error("Error: ", error.message);
        }
    }
    FetchData();
    
}
