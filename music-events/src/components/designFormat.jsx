import React from "react";
import Navbar from "./navbar/Navbar";
import Sideplane from "./sideplane/Sideplane"; 


function designFormat({ children }) {
  return (
    <div>
      <Navbar />
      <Sideplane /> 
    </div>
  );
}

export default designFormat;