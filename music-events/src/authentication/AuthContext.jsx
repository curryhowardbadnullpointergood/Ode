import React, {createContext, useState, useEffect} from "react";
import placeholder from "../assets/placeholder.jpg"

// context storing the Authentication details that can be used later on
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        token: null, // the username aka id in <user/:id> routing   
        loading: true,
        account_type : ""
    });

    const [userData, setUserData] = useState({  // storing the data of the logged in user
        id: "",
        username: "",
        name: "",
        profile_picture: "",
        interests: [],
        events_interested: [],
        friends: [],
        bio: "",
        email: "",
        // organisation
        // event_created
    })

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {  // handle side effect of stored information by browser to ensure user won't log off when refreshing their screen
        const token = sessionStorage.getItem("authToken");
        const user_data_22 = sessionStorage.getItem("user_data_22");
        const acc_type = sessionStorage.getItem("user_type");
        let parsedData = null;
        if (user_data_22) { // parsedata: parsing user_data_22 object
            try {
                parsedData = JSON.parse(user_data_22);
                //console.log(parsedData);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            console.log("No data found in sessionStorage");
        }
        if (token) {
            setAuth({isLoggedIn: true, token: token, loading: false, account_type : acc_type});
            setUserData(parsedData);
        } else {
            setAuth({isLoggedIn: false, token: null, loading: false});
        }
    }, []);

    const login_auth = (token, type) => { // log in authentication method
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user_type", type);
        setAuth({isLoggedIn: true, token, loading: false, account_type : type});
    };

    const logout_auth = () => { // remove authentication state when log out
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("user_type");
        setAuth({isLoggedIn: false, token: null, loading: false});
        setUserData({
            id: "",
            username: "",
            name: "",
            profile_picture: "",
            interests: [],
            events_interested: [],
            friends: [],
            bio: "",
            email: "",
        });
    };

    const set_user_detail = (userId,data, type) => { // saving user information
        let data_to_write = {}
        if (type === "user"){
            data_to_write = {
                id: userId,
                username: data["username"],
                name: data["name"],
                profile_picture: data["profile_picture"],
                interests: data["interests"],
                events_interested: data["events_interested"],
                friends: data["friends"],
                bio: data["bio"],
                email: data["email_address"],
            }
        }
        else if (type === "admin"){
            data_to_write = {
                id: userId,
                username: data["organisation"], // actually organisation, but use username for better handling
                name: data["name"],
                profile_picture: data["profile_picture"],
                events_created : data["events_created"],
                bio: data["bio"],
                email: data["email_address"],
            }   
        }
        const b =  JSON.stringify(data_to_write)
        sessionStorage.setItem("user_data_22", b);
        setUserData(data_to_write);
    }
    



    return (
        <AuthContext.Provider value={{auth, userData, login_auth, logout_auth, set_user_detail, searchQuery, setSearchQuery}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;