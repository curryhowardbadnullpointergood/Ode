import React, { createContext, useState, useEffect } from "react";

// context storing the Authentication details that can be used later on
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
      isLoggedIn: false,
      token: null, // the username aka id in <user/:id> routing
      loading: true
    });
  
    useEffect(() => {
      const token = sessionStorage.getItem("authToken");
      console.log("useEffect called!");
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
      console.log("++++++++++++++");
      console.log(token);
      console.log("is Logged in: ",auth.isLoggedIn);
    };
  
    const logout_auth = () => {
      sessionStorage.removeItem("authToken");
      setAuth({ isLoggedIn: false, token: null , loading: false });
    };
  
    return (
      <AuthContext.Provider value={{ auth, login_auth, logout_auth }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
export default AuthContext;