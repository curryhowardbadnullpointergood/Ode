import "./profile.scss";
import { useLoaderData, useParams, withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import {useState, useContext, useEffect} from "react";
import HandleUserInfo from "../../apiFunctions/HandleUserInfo";
import HandleAdminInfo from "../../apiFunctions/HandleAdminInfo";
import Friend_list from "./popup_screen/Friend_list";
import AuthContext from "../../authentication/AuthContext";
import HandleFollowUser from "../../apiFunctions/HandleFollowUser"

// this should be linked back to the profile of the person in question 
// background image and profile pic 
// have a default background image otherwise, these trees work fine for now 
// else show their background image 
// name needs to be dynamic as well these are dummy values 
// make bio dynamic 

import back from "../../assets/profile_background.jpg"
import Sophie from "../../assets/anne-sophie-mutter_profile.jpg"
import placeholder from "../../assets/placeholder.jpg"

const Profile = () => {
    const params = useParams();
	const [userData_profile, setUserData_profile] = useState(null);
    const [userData_profile_admin, setUserData_profile_admin] = useState(null);
    
    const [followed, setFollowed] = useState("Click to Follow!");
    const [exist, setExist] = useState(false);
    //console.log("userData: ",userData_profile);
    //console.log("follow: ", followed);
    const {auth, logout_auth, userData,set_user_detail} = useContext(AuthContext);
    let exists = true;
    

    // the following is the variable controlling the showing. 
    // Can be removed once everything is tested but for simpicity we just connecting the info from api to them first: Lucas
    let interests = [];
    const [events_interested, setEvents_interested] = useState(["event1","event2","event3"]);
    //const [name, setName] = useState("name");
    const [friends, setFriends] = useState();
    const [nickname, setNickName] = useState("nickname");
    const [image, setImage] = useState();
    const [image_user, setImage_user] = useState();
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => { // use Effect for data retrieval
        const fetchUserInfo = async () => {
            try{
            const response = await HandleUserInfo(params.id, setUserData_profile, auth, userData,set_user_detail);
            const res = await HandleAdminInfo(params.id, setUserData_profile_admin, auth, userData,set_user_detail);
            }
            catch(err){
                console.error(err);
            }
            finally{
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [params.id]);
    
    


    useEffect(  () => { // useEffect for data handling
        console.log("userData_profile: ", userData_profile);
        console.log("userData_profile_admin: ", userData_profile_admin);
        // the data retrieved from api will have time delay that making userData empty here. Should have a loading screen before it arrives
        if ( auth.account_type === "user" && userData_profile !== null && userData_profile !== "User not found"){ // for user info
            setExist(true);
            console.log("finally");
            //console.log("userData_profile[\"interests\"]: ",userData_profile["interests"]);
            interests = userData_profile["interests"];
            setBio(userData_profile["bio"]);
            setNickName(userData_profile["name"]);
            setFriends(userData_profile["friends"]);
            setEvents_interested(userData_profile["events_interested"]);
            if (userData_profile["profile_picture"] === "" || userData_profile["profile_picture"] === null){ // placeholder image
                //console.log("no photo");
                userData_profile["profile_picture"] = placeholder;
                setImage_user(placeholder);
            }
            if( userData_profile["friends"].includes(auth.token)){
                setFollowed("followed");
                setImage_user(userData_profile["profile_picture"]);
            }
        }
        else if (auth.account_type === "admin" &&userData_profile_admin !== null && userData_profile_admin !== "User not found"){ //admin info
            //console.log("hi");
            //console.log(userData_profile_admin);
            setExist(true);
            if (userData_profile_admin["profile_picture"] === "" ){ // placeholder image
                setImage(placeholder);
                userData_profile_admin["profile_picture"] = placeholder;
                
            }
            else{
                setImage(userData_profile_admin["profile_picture"]);
            }
        }
    
    },[userData_profile, userData_profile_admin,exist])
    
    
    
    const LoginUserProfile = () =>  {  // list of buttons made available solely for login user ---- this is some horrible horrible code!!!!!
        
        if (params.id ===auth.token ){
        
            return (
                
          
            <div className="styled">
                    <Link to = '/update_profile'>  {/* update profile */}
                        <button className="button">Update Profile</button>
                    </Link>
                    <Link to = '/login'> {/* logout */}
                        <button className="button2" onClick={logout_auth}>logout</button>
                    </Link>
                </div>
        )
        }
    }

    const follow_option = () => {
        if (params.id !==auth.token && auth.token!== null  ){
            return (
                <div>
                    <button onClick={handleFollow}>
                        {followed}
                    </button>
                </div>
            )
        }
    }

    const handleFollow = () => {
        //console.log("Button clicked!");
        if (followed == "Click to Follow!"){
            HandleFollowUser(userData_profile["username"], auth.token );
        }
        else{
            alert("You have followed this person!");
        }
            
        
      };

    const renderInterest = () => {
        return (
            auth.account_type === "user" && userData_profile !== "User not found" && userData_profile !== undefined &&
            <>
                <span>Interests</span> {/*The part showing the interest of this player. Need styling */}
                <ul className="interest">
                    {userData_profile["interests"].map((fav) => (
                        <li key={fav}>{fav}</li>
                    ))}
                </ul>
            </>
        )
    }

    const renderEventInterested = () => {
        return (
            auth.account_type === "user" && userData_profile !== "User not found" &&
            <>
                <span>Events interested</span> {/*The part showing the interested event of this player. Need styling */}
                <ul className="interest">
                    {events_interested.map((fav) => (
                        <li key={fav}>{fav}</li>
                    ))}
                </ul>
            </>
        )
    }

    const renderSpotify = () => {
        return (
            auth.account_type === "user" &&
            /* Spotify Playlist Integration */
            <div className="spotify-embed">
            <h2 className="centered-title">Recommended Playlist:</h2>            
            <iframe
                title="Spotify Embed: Recommendation Playlist"
                src={`https://open.spotify.com/embed/playlist/6ApWSZHI5Bn86iWZXw9utu?utm_source=generator&theme=0`}
                width="100%"
                height="360"
                style={{ minHeight: "360px" }}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                ></iframe>
            </div>
        )
    }

    const displayName = () => {
        if (auth.account_type === "user"){
            return(
                <>
                    <h1>{userData_profile["username"]}</h1> {/*displaying username*/}
                    <span> {userData_profile["name"]}</span>  {/*displaying name*/}
                </>
        )
        }
        else if ((auth.account_type === "admin")){
            return(
                <>
                    <h1>{userData_profile_admin["organisation"]}</h1> {/*displaying username*/}
                    <span> {userData_profile_admin["name"]}</span>  {/*displaying name*/}
                </>
            )
        }
    }
    if (loading) {
        return <div>Loading...</div>; // Display a loading screen while data is being fetched
    }
    try{
        return(
            exist &&
            // if user exist, display the following
            <div className="profile"> 
            <div className="profileimages">
                
                <img src={back} alt="" className="background" />
                
                { auth.account_type ==="user" && <img src={userData_profile["profile_picture"]} alt="" className="profile" />}
                { auth.account_type ==="admin" && <img src={image} alt="" className="profile" />}
            </div>
            <div className="personalinformation">
                {displayName()}
                {LoginUserProfile()}
                {follow_option()}
                {auth.account_type ==="user" && <Friend_list list = {friends} />} {/*displaying firend list in a pop up manner with basic styling. Tho need amendment on display later on*/}
                <div className="bio">
                    { auth.account_type ==="user" && <p>{userData_profile["bio"]}</p> }
                    { auth.account_type ==="admin" && <p>{userData_profile_admin["bio"]}</p> }
                </div>

                {renderEventInterested()}
            
                {renderInterest()}

                {renderSpotify()}
            </div>
            </div>
        )
    }
    catch(err){
        console.log("error: ", err);
    }
}

export default Profile

