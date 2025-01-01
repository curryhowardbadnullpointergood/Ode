import React, { useState, useContext, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { collection, getDocs } from 'firebase/firestore';

import AuthContext from "../../authentication/AuthContext";

import { ChannelListContainer, ChannelContainer } from '../../components/chat';

import { db } from "../../components/chat/firebase";


import 'stream-chat-react/dist/css/v2/index.css';

import './chat.scss';

const App = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const apiKey = 'h7328t4djfyz';


    const { userData } = useContext(AuthContext);
    const currentUser = userData.username;


    const client = StreamChat.getInstance(apiKey);

    const registerUsers = async () => {
        try {

            const usersCollection = collection(db, 'users'); 
            const querySnapshot = await getDocs(usersCollection);

            const users = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                const id = data.username.toLowerCase().replace(/\s+/g, '');

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

   
    useEffect(() => {
        registerUsers();
    }, []); 

    const devToken = client.devToken(currentUser);

    const currentId = currentUser.toLowerCase().replace(/\s+/g, '');

    client.connectUser(
        {
            id: currentId,
            name: currentUser,
            image: userData.profile_picture
        },
        devToken 
    );

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