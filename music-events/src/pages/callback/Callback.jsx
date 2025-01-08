import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const token = new URLSearchParams(hash.substring(1)).get("access_token");
            if (token) {
                localStorage.setItem('spotify_token', token);
                // Get the stored profile ID
                const profileId = localStorage.getItem('spotify_redirect_profile');
                // Remove the stored profile ID
                localStorage.removeItem('spotify_redirect_profile');
                // Redirect back to the profile page
                navigate(`/profile/${profileId}`);
            }
        }
    }, [navigate]);

    return (
        <div>
            Loading...
        </div>
    );
};

export default Callback;