import React, { createContext, useState, useEffect } from "react";

// context storing the Authentication details that can be used later on
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
      isLoggedIn: false,
      token: null, // the username aka id in <user/:id> routing
      loading: true
    });

    const [userData, setUserData] = useState({
      username : "",
      name: "",
      profile_picture: "",
      interests: [],
      events_interested : [],
      friends : []
    })
  
    useEffect(() => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        setAuth({ isLoggedIn: true, token: token,loading: false  });
      }
      else {
        setAuth({ isLoggedIn: false, token: null, loading: false });
      }
    }, []);
  
    const login_auth = (token) => {
      sessionStorage.setItem("authToken", token);
      setAuth({ isLoggedIn: true, token , loading: false });
    };
  
    const logout_auth = () => {
      sessionStorage.removeItem("authToken");
      setAuth({ isLoggedIn: false, token: null , loading: false });
    };

    const set_user_detail = (data) =>{
      const data_to_write = { 
        username : data["username"] , 
        name: data["name"], 
        profile_picture: data["profile_picture"], 
        interests : data["interests"]  , 
        events_interested : data["events_interested"] , 
        friends : data["friends"]
      }
      setUserData(data_to_write);
    }
  
    return (
      <AuthContext.Provider value={{ auth, userData , login_auth, logout_auth, set_user_detail }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
export default AuthContext;