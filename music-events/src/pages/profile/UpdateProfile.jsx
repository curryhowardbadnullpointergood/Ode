import {useState, useContext} from "react";
import HandleProfileUpdate from "../../apiFunctions/HandleProfileUpdate";
import AuthContext from "../../authentication/AuthContext";
import HandleUserInfo from "../../apiFunctions/HandleUserInfo";
import "./UpdateProfile.scss";
export default function UpdateProfile(){
    const {auth, userData,set_user_detail } = useContext(AuthContext);
    const update_info = HandleUserInfo(auth.token,set_user_detail); // update stored user info before amendment


    const [file, setFile] = useState(); // storing the file
    const [file_url, setFile_url] = useState(); // storing the file
    const [favorites, setFavorites] = useState(userData.interests); // State to store selected favorites
    const interests = ["rock", "pop", "jazz", "classical", "electronic", "hip-hop", "metal", "indie", "folk",
        "r&b", "opera", "piano", "musical theatre", "strings", "guitar", "drums", "bass", "vocals",
        "production", "composition"] // the choice of interests or genre
    
    // hook controlling forms
    const [formName, setFormName] = useState({name: userData.name });
    const [formBio, setFormBio] = useState({bio: userData.bio});
    
    const toggleFavorite = (item) => { // function to add the favourite genre 
        setFavorites((prevFavorites) =>
          prevFavorites.includes(item)
            ? prevFavorites.filter((fav) => fav !== item) // Remove if already selected
            : [...prevFavorites, item] // Add if not selected
        );
      };
    const handleChange= (e,type) => {
        
        const { name, value } = e.target;
        if (type==="name"){
            setFormName({ name: value});
        }
        else if (type==="bio"){
            setFormBio({ name: value});
        }
    }

    const handleImgFile= (e) => {
        console.log(e.target.files[0]);
        let kk = URL.createObjectURL(e.target.files[0]);
        let k = e.target.files[0];
        setFile(k);
        setFile_url(kk);
    }
    
    return(  // for simplicity in functionality development, I use br/ for simple styling. Should be change later : Lucas
        <div className="update_profile">
            <form onSubmit={e => HandleProfileUpdate(e, auth.token, "name" )}>
                <input type="text" placeholder="Enter your name here" name="name" onChange={e => handleChange(e,"name")} value={formName.name}></input>
                <br/>
                <button type="submit">Confirm update</button>
            </form>
            <form onSubmit={e => HandleProfileUpdate(e, auth.token,"bio" )}>
                <textarea id="w3review" name="bio" rows="4" cols="100" onChange={e => handleChange(e,"bio")}  value={formBio.bio}
                    placeholder="Type your bio here to describe yourself!" ></textarea>
                <br/>
                <button type="submit">Confirm update</button>
            </form>

            {/*upload profile pic */}
            <form onSubmit={e => HandleProfileUpdate(e, auth.token,"pic",{file : file} )}>
                <div className="addingImage">
                    <h4>Add Image:</h4>
                    <input type="file" onChange={handleImgFile}  name="profile_picture" />
                    <img src={file_url} />
                </div>
                <br/>
                <button type="submit">Confirm update</button>
            </form>

            
            <form className="interests_choice" 
                onSubmit={e => HandleProfileUpdate(e, auth.token, "interest", { interest : favorites} )}> {/*need amendment later */}
                <label>Please select at least three genre of music you love below</label> 
                <br/>
                {interests.map((item) => (
                    <button type="button" key={item} onClick={() => toggleFavorite(item)}>
                        {item}
                    </button>
                ))}
                {/*displaying current choice */}
                <ul>
                    {favorites.map((fav) => (
                    <li key={fav}>{fav}</li>
                    ))}
                </ul>
                
                <button type="submit">Confirm update</button>
           </form>
        </div>
    )
}