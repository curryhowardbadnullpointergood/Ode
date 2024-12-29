import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";
// blocking route from unauthorised access aka people who haven't logged in
const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (auth.loading) {
    return <div>Loading...</div>;
  }

  return auth.isLoggedIn ? children : <Navigate to="/login" />;

};

export default ProtectedRoute;