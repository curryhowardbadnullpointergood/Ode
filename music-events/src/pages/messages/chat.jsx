import React, { useState, useContext } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import AuthContext from "../../authentication/AuthContext";

import { ChannelListContainer, ChannelContainer } from '../../components/chat';

import 'stream-chat-react/dist/css/index.css';
import './chat.scss';

const App = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const apiKey = 'h7328t4djfyz';

    const{userData} = useContext(AuthContext);
    const currentUser = userData.username;

    const client = StreamChat.getInstance(apiKey);

    const devToken = client.devToken(currentUser);

    client.connectUser(
        {
            id: currentUser,
            name: currentUser,
            image: userData.profile_picture
        },
        devToken // use dev-token
    );

    
    return (
        <div className="app__wrapper">
            <Chat client={client} theme="team light">
                <ChannelListContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                />
                <ChannelContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createType={createType}
                />
            </Chat>
        </div>
    );
}

export default App;