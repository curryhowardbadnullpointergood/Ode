import React from 'react';

import { AddChannel } from '../../assets';

const TeamChannelList = ({ setToggleContainer, children, error = false, loading, isCreating, setIsCreating, setIsEditing }) => {
    if(error) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message">
                    Connection error!
                </p>
            </div>
        )
    }

    if(loading) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message loading">
                    loading...
                </p>
            </div>
        )
    }

    return (
        <div className="team-channel-list">
            <div className="team-channel-list__header">
                <p className="team-channel-list__header__title">
                    {'Messages'}
                </p>
                <AddChannel 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
            {children}
        </div>
    )
}

export default TeamChannelList
