import React, { useState } from "react";
import "./Friend_list.scss";

const Friend_list = ({list}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Manage popup visibility
  const friends = list; // List of friends
  console.log("friends: ", friends);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen); // Toggle popup visibility
  };

  return (
    <div className="friend-list-popup">
      {/* Button to toggle the popup */}
      <button onClick={togglePopup} className="toggle-button">
        {isPopupOpen ? "Close Friends List" : "Open Friends List"}
      </button>

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Friends List</h2>
            <ul>
              {friends.map((friend, index) => (
                <li key={index}>{friend}</li>
              ))}
            </ul>
            <button onClick={togglePopup} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default Friend_list;