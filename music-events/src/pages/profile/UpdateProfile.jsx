import {useState, useContext, useEffect} from "react";
import HandleProfileUpdate from "../../apiFunctions/HandleProfileUpdate";
import AuthContext from "../../authentication/AuthContext";
import HandleUserInfo from "../../apiFunctions/HandleUserInfo";
import HandleAdminUpdate from "../../apiFunctions/HandleAdminUpdate";
import "./UpdateProfile.scss";
export default function UpdateProfile(){
    const {auth, userData,set_user_detail } = useContext(AuthContext);
    const [file, setFile] = useState(); // storing the file
    const [file_url, setFile_url] = useState(); // storing the file
    const [favorites, setFavorites] = useState(userData.interests); // State to store selected favorites
    const interests = ["rock", "pop", "jazz", "classical", "electronic", "hip-hop", "metal", "indie", "folk",
        "r&b", "opera", "piano", "musical theatre", "strings", "guitar", "drums", "bass", "vocals",
        "production", "composition"] // the choice of interests or genre
    
    // hook controlling forms
    console.log("userData: ",userData );
    const [formName, setFormName] = useState({name: userData.name });
    const [formBio, setFormBio] = useState({bio: userData.bio});
    

    useEffect(() => {
        //const update_info = HandleUserInfo(auth.token,set_user_detail,auth, userData,set_user_detail); // update stored user info before amendment

        //const admin_info = HandleUserInfo(auth.token,set_user_detail,auth, userData,set_user_detail);
    },[])
    
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
            { auth.account_type === "user" &&  <form onSubmit={e => HandleProfileUpdate(e, auth.token, "name" )}>
                <h3>Enter your name</h3>
                <input type="text" placeholder="Enter your name here" name="name" onChange={e => handleChange(e,"name")} value={formName.name}></input>
                <br/>
                <button type="submit">Confirm update</button>
            </form>}

            { auth.account_type === "admin" &&  <form onSubmit={e => HandleAdminUpdate(e, auth.token, "name" )}>
                <h3>Enter your name</h3>
                <input type="text" placeholder="Enter your name here" name="name" onChange={e => handleChange(e,"name")} value={formName.name}></input>
                <br/>
                <button type="submit">Confirm update</button>
            </form>}

            {auth.account_type === "user" && <form onSubmit={e => HandleProfileUpdate(e, auth.token,"bio" )}>
                <h3>Introduce yourself!</h3>
                <textarea id="w3review" name="bio" rows="4" cols="100" onChange={e => handleChange(e,"bio")}  value={formBio.bio}
                    placeholder="Type your bio here to describe yourself!" ></textarea>
                <br/>
                <button type="submit">Confirm update</button>
            </form>}

            {auth.account_type === "admin" && <form onSubmit={e => HandleAdminUpdate(e, auth.token,"bio" )}>
                <h3>Introduce your organisation!</h3>
                <textarea id="w3review" name="bio" rows="4" cols="100" onChange={e => handleChange(e,"bio")}  value={formBio.bio}
                    placeholder="Type your bio here to describe yourself!" ></textarea>
                <br/>
                <button type="submit">Confirm update</button>
            </form>}

            {/*upload profile pic */}
            {auth.account_type === "user" && <form onSubmit={e => HandleProfileUpdate(e, auth.token,"pic",{file : file} )}>
                <h3>Profile Picture</h3>
                <div className="addingImage">
                    <h4>Add Image:</h4>
                    <input type="file" onChange={handleImgFile}  name="profile_picture" />
                    <img src={file_url} />
                </div>
                <br/>
                <button type="submit">Confirm update</button>
            </form>}

            {auth.account_type === "admin" && <form onSubmit={e => HandleAdminUpdate(e, auth.token,"pic",{file : file} )}>
                <h3>Profile Picture</h3>
                <div className="addingImage">
                    <h4>Add Image:</h4>
                    <input type="file" onChange={handleImgFile}  name="profile_picture" />
                    <img src={file_url} />
                </div>
                <br/>
                <button type="submit">Confirm update</button>
            </form>}

            
            {auth.account_type === "user" && <form className="interests_choice" 
                onSubmit={e => HandleProfileUpdate(e, auth.token, "interest", { interest : favorites} )}> {/*need amendment later */}
                <h3>Genre</h3>
                <label>Please select at least three genre of music you love below</label> 
                <br/>


               

                <div className="genreList">
                    {interests.map((item) => (
                        <button 
                            type="button" 
                            key={item} 
                            onClick={() => toggleFavorite(item)}
                            className={`genre-button ${favorites.includes(item) ? "active" : ""}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                
                
                <button type="submit">Confirm update</button>
           </form>}
        </div>
    )
}