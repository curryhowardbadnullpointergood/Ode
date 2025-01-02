import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';


const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">Chat</p>
    </div>
)

const ChannelListContent = ({ isCreating, setIsCreating, setIsEditing, setToggleContainer }) => {
    const { client } = useChatContext();

    const filters = { members: { $in: [client.userID] } };

    return (
        <>
            <div className="channel-list__list__wrapper">
                <CompanyHeader />
                <ChannelList 
                    filters={filters}
                    List={(listProps) => (
                        <TeamChannelList 
                            {...listProps}
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview 
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                />
            </div>
        </>
    );
}

const ChannelListContainer = ({ setIsCreating, setIsEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            <div className="channel-list__container">
              <ChannelListContent 
                setIsCreating={setIsCreating} 
                setIsEditing={setIsEditing} 
              />
            </div>

            <div className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%" }}
            >
                <div className="channel-list__container-toggle" onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                </div>
                <ChannelListContent 
                setIsCreating={setIsCreating} 
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            </div>
        </>
    )

}

export default ChannelListContainer;