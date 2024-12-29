import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1anHKurd8uwdcyFrnpAxVzptJUENjhoo",
    authDomain: "music-network-e75a1.firebaseapp.com",
    projectId: "music-network-e75a1",
    storageBucket: "music-network-e75a1.firebasestorage.app",
    messagingSenderId: "1074001803261",
    appId: "1:1074001803261:web:3fa4fc230390b54ab98b94",
    measurementId: "G-4XR8D51BNR"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiver, setReceiver] = useState("");
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        const messagesRef = collection(db, "messages");
        const messageQuery = query(
            messagesRef,
            where("receiver", "==", currentUser)
        );

        const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const message = change.doc.data();
                    setMessages((prevMessages) => [...prevMessages, message]);
                }
            });
        });

        return () => unsubscribe();
    }, [currentUser]);

    const sendMessage = () => {
        const uri = "http://localhost:8080/chat/create";
        const data = {
            sender: currentUser,
            receiver: receiver,
            message: newMessage,
        };

        fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Message sent successfully:", data);
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });

        setNewMessage("");
    };

    const renderMessages = () =>
        messages.map((message, index) => (
            <div key={index}>
                <strong>From:</strong> {message.sender} <br />
                <strong>Message:</strong> {message.message}
            </div>
        ));

    return (
        <div>
            <h1>Chat</h1>
            <p><strong>Current User:</strong> {currentUser}</p> {/* 显示currentUser */}
            <div>{renderMessages()}</div>
            <input
                type="text"
                value={currentUser}
                placeholder="Sender"
                onChange={(e) => {
                    setCurrentUser(e.target.value);
                }}
            />
            <input
                type="text"
                value={receiver}
                placeholder="Receiver"
                onChange={(e) => {
                    setReceiver(e.target.value);
                }}
            />
            <input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
};

export default ChatComponent;