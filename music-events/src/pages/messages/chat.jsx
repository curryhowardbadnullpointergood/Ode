import React, { useState, useContext, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { collection, getDocs } from 'firebase/firestore';

import AuthContext from "../../authentication/AuthContext";

import { ChannelListContainer, ChannelContainer } from '../../components/chat';

import { db } from "../../components/chat/firebase";

import 'stream-chat-react/dist/css/v2/index.css';

import './chat.scss';

const apiKey = 'khmcwws8htv6';
const client = StreamChat.getInstance(apiKey);

const userData = JSON.parse(localStorage.getItem('userData'));  
const currentUser = userData.username;

const devToken = client.devToken(currentUser);

const currentId = currentUser.replace(/[^a-z0-9@_\-]/gi, '');

    if (!client.userID) { // Check if user is already connected
        client.connectUser(
            {
                id: currentId,
                fullName: currentUser,
                image: userData.profile_picture
            },
            devToken 
        );
    } else {
        console.log('User already connected:', client.userID);
    };


const App = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    const registerUsers = async () => {
        try {

            const usersCollection = collection(db, 'users'); 
            const querySnapshot = await getDocs(usersCollection);

            const users = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log('User data:', data);
                console.log(data.username);

                const id = data.username.replace(/[^a-z0-9@_\-]/gi, '');

                users.push({
                    id: id, 
                    fullName: data.username,
                    image: data.profile_picture || '' 
                });
            });

            if (users.length > 0) {
                await client.upsertUsers(users);
                console.log('Users registered successfully:', users);
            }
        } catch (error) {
            console.error('Error registering users:', error);
        }
    };


    return (
        <div className="app__wrapper">
            <Chat client={client} theme="team light">
                <ChannelListContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                />
                <ChannelContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
            </Chat>
        </div>
    );
}

export default App;
