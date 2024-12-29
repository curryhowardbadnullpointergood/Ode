import React, { useContext, useState } from "react";
import Img from "../../img/img.png";
import Attach from "../../img/attach.png";
import { ChatContext } from "../../context/ChatContext";

const Input = ({ currentUser }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { data } = useContext(ChatContext);

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
        const uri = "http://localhost:8080/chat/image"; // 替换为后端地址
        const formData = new FormData(); // 使用 FormData 处理图片和文本
      
        // 添加字段到表单数据
        formData.append("sender", currentUser);
        formData.append("receiver", data.user);
        formData.append("file", img);  // 添加图片文件
      
        try {
          const response = await fetch(uri, {
            method: "POST",
            body: formData, // FormData 自动设置合适的请求头
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
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
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