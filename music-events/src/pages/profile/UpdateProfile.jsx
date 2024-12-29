import {useState} from "react";
import { useNavigate } from "react-router-dom"
import HandleProfileUpdate from "../../apiFunctions/HandleProfileUpdate"
export default function UpdateProfile(){
    
    const navigate = useNavigate(); // Hook for navigation
    const [favorites, setFavorites] = useState([]); // State to store selected favorites
    const interests = ["rock", "pop", "jazz", "classical", "electronic", "hip-hop", "metal", "indie", "folk",
        "r&b", "opera", "piano", "musical theatre", "strings", "guitar", "drums", "bass", "vocals",
        "production", "composition"] // the choice of interests o genre

    const toggleFavorite = (item) => { // function to add the favourite genre 
        setFavorites((prevFavorites) =>
          prevFavorites.includes(item)
            ? prevFavorites.filter((fav) => fav !== item) // Remove if already selected
            : [...prevFavorites, item] // Add if not selected
        );
      };
    
    return(
        <div>
           <form onSubmit={e => HandleProfileUpdate(e, navigate)}>
                <input type="text" placeholder="Enter your name here"></input>
                <br/>
                <textarea id="w3review" name="w3review" rows="4" cols="50" placeholder="Type your bio here to describe yourself!"></textarea>
                <br/>
                <label>Please select at least three genre of music you love below</label> 
                <br/>
                {interests.map((item) => (
                    <button key={item} onClick={() => toggleFavorite(item)}>
                        {item}
                    </button>
                ))}

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