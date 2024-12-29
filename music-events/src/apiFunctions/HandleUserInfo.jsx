import axios from "axios";
import {useEffect, useState} from "react";
export default async function HandleUserInfo(id, setUserData) {
    const path = 'http://localhost:8080/user/view_user';
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
                const response = await axios.post(path,{"username" : id} );
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
                    setUserData(reply);
                   
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
    },[])
}
