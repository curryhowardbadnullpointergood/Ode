import React, { useState, useEffect, useContext } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { collection, getDocs } from 'firebase/firestore';

import AuthContext from "../../authentication/AuthContext";

import { ChannelListContainer, ChannelContainer } from '../../components/chat';
import { db } from "../../components/chat/firebase";

import 'stream-chat-react/dist/css/v2/index.css';
import './chat.scss';

// Stream Chat 客户端实例
const apiKey = 'khmcwws8htv6';
const client = StreamChat.getInstance(apiKey);

const App = () => {
    // 状态管理
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null); // 用户数据状态
    const [loading, setLoading] = useState(true);  // 加载状态

    // 获取 AuthContext 中的用户信息
    const authContext = useContext(AuthContext);

    // 从 sessionStorage 加载用户数据
    useEffect(() => {
    
            setUserData(authContext.userData);
            
        
    }, [authContext]); // 监听 AuthContext 变化

    // 注册用户
    const registerUsers = async () => {
        try {
            const usersCollection = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollection);

            const users = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log('User data:', data);

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

    // 连接用户到 Stream Chat
    const connectUser = async (user) => {
        if (!user) return;

        try {
            const currentUser = user.username;
            const devToken = client.devToken(currentUser);
            const currentId = currentUser.replace(/[^a-z0-9@_\-]/gi, '');

            await client.connectUser(
                {
                    id: currentId,
                    fullName: currentUser,
                    image: user.profile_picture
                },
                devToken
            );

            console.log('User connected:', currentUser);
        } catch (error) {
            console.error('Error connecting user:', error);
        }
    };

    const disconnectUser = async () => {
        if (client.userID) { // 检查当前是否有用户连接
            await client.disconnectUser(); // 断开连接
            console.log('User disconnected.');
        }
    };
    

    // 在 userData 更新时执行注册和连接
    useEffect(() => {
        const initChat = async () => {
            if (userData) {
                await disconnectUser(); 
                await connectUser(userData);
                await registerUsers();
                setLoading(false); // 数据加载完成
            }
        };
        initChat();
    }, [userData]); // 依赖 userData

    // 加载中显示提示
    if (loading) {
        return <div>Loading...</div>;
    }

    // 渲染界面
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
};

export default App;


