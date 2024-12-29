import React, {useState, useEffect} from "react";
import {initializeApp} from "firebase/app";
import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA3LSf3sYRzfcWXycl_ivRCu_UJ7kV0NCU",
    authDomain: "music-event-app-442810.firebaseapp.com",
    projectId: "music-event-app-442810",
    storageBucket: "music-event-app-442810.firebasestorage.app",
    messagingSenderId: "568353778562",
    appId: "1:568353778562:web:a26e1e897848d3052a7d9b",
    measurementId: "G-FHXQXYSKWJ"
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
            where("receiver", "==", currentUser),
            where("sender", "==", receiver)
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
    }, [currentUser, receiver]);

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
                <strong>From:</strong> {message.sender} <br/>
                <strong>Message:</strong> {message.message}
            </div>
        ));

    return (
        <div>
            <h1>Chat</h1>
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
