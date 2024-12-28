import axios from "axios";
import {useEffect, useState} from "react";
export default async function HandleUserInfo(id, setUserData) {
    const path = 'http://localhost:8080/user/view_user';
    useEffect (() => {
        const fetchData = async() => {
            try{    
                const response = await axios.post(path,{"username" : id} );
                //console.log("response: ", response);
                if (response.data.status === "success"){
                    setUserData(response.data.data);
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
