import React, { useContext, useState } from "react";
import Img from "../../img/img.png";
import Attach from "../../img/attach.png";
import { ChatContext } from "../../context/ChatContext";
import AuthContext from "../../authentication/AuthContext";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null); 

  const { data } = useContext(ChatContext);

  const{userData} = useContext(AuthContext);
  const currentUser = userData.username;

 
  const sendMessage = () => {
    const uri = "http://localhost:8080/chat/create";
    const sb = {
      sender: currentUser,
      receiver: data.user,
      message: text,
    };

    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sb),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Message sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

 
  const sendImageMessage = async () => {
    const uri = "http://localhost:8080/chat/image";
    const formData = new FormData();

    
    formData.append("sender", currentUser);
    formData.append("receiver", data.user);
    formData.append("file", img);

    try {
      const response = await fetch(uri, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.status === "success") {
        console.log("Image sent successfully:", result);
      } else {
        console.error("Failed to send image:", result.message);
      }
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

 
  const handleSend = async () => {
    if (img) {
      await sendImageMessage();
    } else {
      sendMessage();
    }

    setText("");
    setImg(null);
    setPreview(null); 
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);

     
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      e.target.value = null;
    }
  };

  return (
    <div className="input">
      <div className="input-wrapper">
        {/* show the image */}
        <div className="input-content">
          {preview ? (
            <img src={preview} alt="preview" className="image-preview" />
          ) : (
            <input
              type="text"
              placeholder="Type something..."
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}
        </div>
      </div>

      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleImageChange}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
