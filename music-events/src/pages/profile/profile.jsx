import "./profile.scss";
import { useLoaderData, useParams, withRouter } from "react-router-dom";
import { Link } from "react-router-dom"
import {useState, useContext, useEffect} from "react";
import HandleUserInfo from "../../apiFunctions/HandleUserInfo";
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

const Profile = (props) => {
    const params = useParams();
	const [userData_profile, setUserData_profile] = useState({
        "interests" : []
    });
    const [followed, setFollowed] = useState("Click to Follow!");
    let exist = true;
    const response = HandleUserInfo(params.id,setUserData_profile);
    //console.log("userData: ",userData_profile);
    //console.log("follow: ", followed);
    const {auth, logout_auth, userData} = useContext(AuthContext);
    

    // the following is the variable controlling the showing. 
    // Can be removed once everything is tested but for simpicity we just connecting the info from api to them first: Lucas
    let interests = [];
    let events_interested = ["event1","event2","event3"];
    //let [name, setName] = useState("name");
    let [friends, setFriends] = useState(["friend1", "friend2", "friend3", "friend4", "friend5" ]);
    let [nickname, setNickName] = useState("nickname");
    let [bio, setBio] = useState("");
    useEffect(() =>{
        // the data retrieved from api will have time delay that making userData empty here. Should have a loading screen before it arrives
        if (userData_profile === "User not found" || userData_profile.name === undefined){ // user not found or the data hasn't arrived yet
            exist = false;
        }
        else{ // data arrives
            console.log(userData_profile);
            //console.log("userData_profile[\"interests\"]: ",userData_profile["interests"]);
            interests = userData_profile["interests"];
            setBio(userData_profile["bio"]);
            setNickName(userData_profile["name"]);
            setFriends(userData_profile["friends"]);
            if (userData_profile["profile_picture"] === "" || userData_profile["profile_picture"] === null){ // placeholder image
                userData_profile["profile_picture"] = placeholder;
            }
            if( userData_profile["friends"].includes(auth.token)){
                setFollowed("followed");
            }
        }
    },[userData_profile])
        
    
    
    
    const LoginUserProfile = () =>  {  // list of buttons made available solely for login user
        if (params.id ===auth.token ){
            return (
                <div>
                    <Link to = '/update_profile'>  {/* update profile */}
                        <button>Update Profile</button>
                    </Link>
                    <Link to = '/login'> {/* logout */}
                        <button onClick={logout_auth}>logout</button>
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

    return(
        exist &&   // if user exist, display the following
        <div className="profile"> 
        <div className="profileimages">
            
            <img src={back} alt="" className="background" />
            <img src={userData_profile["profile_picture"]} alt="" className="profile" />
        </div>
        <div className="personalinformation">
            <h1>{userData_profile.username}</h1> {/*displaying username*/}
            <span> {nickname}</span>  {/*displaying name*/}
            {LoginUserProfile()}
            {follow_option()}
            <Friend_list list = {friends} /> {/*displaying firend list in a pop up manner with basic styling. Tho need amendment on display later on*/}
            <div className="bio">
                <p>
                {bio}
                </p>
            </div>

            <span>Events interested</span> {/*The part showing the interested event of this player. Need styling */}
            <ul className="interest">
                {events_interested.map((fav) => (
                    <li key={fav}>{fav}</li>
                ))}
            </ul>

            <span>Interests</span> {/*The part showing the interest of this player. Need styling */}
            <ul className="interest">
                {userData_profile["interests"].map((fav) => (
                    <li key={fav}>{fav}</li>
                ))}
            </ul>

            {/* Spotify Playlist Integration */}
            <div className="spotify-embed">
            <h2 className="centered-title">Recommended Playlist</h2>            
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
        </div>
        </div>
    )
}

export default Profile

