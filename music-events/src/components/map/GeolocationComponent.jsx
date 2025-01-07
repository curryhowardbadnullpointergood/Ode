import { useRef, useEffect,useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import 'mapbox-gl/dist/mapbox-gl.css';
import './testing.css'
import {useContext} from "react";
import AuthContext from "../../authentication/AuthContext";
import HandleFriendData from "../../apiFunctions/HandleFriendData"
import HandleFriendLocation from "../../apiFunctions/HandleFriendLocation"
import placeholder from "../../assets/placeholder.jpg"

function GeolocationComponent() {

  const mapRef = useRef()
  const mapContainerRef = useRef()
  const [location, setLocation] = useState(null);
  const [profilePics,setProfilePics] = useState([]);
  const [position_friends,setPosition_friends] = useState([]);
  const [error, setError] = useState(null);
  const {auth, login_auth, userData, set_user_detail} = useContext(AuthContext); 
  let friends_data = []
  let profile_pic_me = userData["profile_picture"];
// get user location and friends location
  const getLocation = async () => {
  try {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });
    if (auth.token!== null){
      await saveLocationToFirestore(latitude, longitude); // Assuming saveLocationToFirestore is async
      //console.log(userData["friends"]);
      let friends_pic = await HandleFriendData(auth.token, userData["friends"], "profile_picture"  ,setProfilePics);
      let friends_pos  = await HandleFriendLocation(userData["friends"], setPosition_friends);
      // merge the two thing above:
      for (let i = 0 ; i < userData["friends"].length; i++){
        if (friends_pic[i]["username"] === friends_pos[i]["username"] && !friends_data.some(obj => obj.username === friends_pos[i]["username"])){
          friends_data.push({
            "username" : friends_pic[i]["username"],
            "profile_picture" : friends_pic[i]["field_data"],
            "latitude" : friends_pos[i]["latitude"],
            "longitude" : friends_pos[i]["longitude"]
          });
        }
      }
      //console.log("friends_data", friends_data);
    }
    
    return { latitude, longitude };
  } catch (err) {
    setError(err.message);
    console.log(err.message);
  }
};
// save the data to firestore
  const saveLocationToFirestore = async (latitude, longitude) => {
    try {
      const userId = auth.token; // Replace with actual user ID (e.g., from Firebase Auth)
      await setDoc(doc(db, "locations_user", userId), {
        latitude,
        longitude,
        timestamp: new Date(),
      });
      console.log("Location saved to Firestore!");
    } catch (err) {
      console.error("Error saving location to Firestore:", err);
    }
  };


  const createCustomMarker = (imageUrl, size = 50) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.width = `${size}px`;
    markerElement.style.height = `${size}px`;
    markerElement.style.borderRadius = '50%'; // Makes the image circular
    markerElement.style.overflow = 'hidden';
    markerElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    const img = document.createElement('img');
    img.src = imageUrl;
    if (imageUrl === "" || imageUrl === null){
      img.src = placeholder;
    }
    img.alt = 'Friend Profile Picture';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover'; // Ensures the image fills the container
    markerElement.appendChild(img);

    return markerElement;
  };



// map create and adding pins
  useEffect(() => {
    const init = async() =>{ 
      try{
      let pos = await getLocation();
      mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXN0MDYwMSIsImEiOiJjbTVreWVnNHYxcGJ2MmlzN3ZwY3cwb3g3In0.qk6JCU_FvvVC5QGmam0wvQ'
      let map = {};
      map = {
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center : [pos.longitude, pos.latitude], 
        zoom: 15.12}

      mapRef.current = new mapboxgl.Map(map);

      mapRef.current.on('load', () => {
        // Map each friend's data to GeoJSON features with associated profile pictures
        
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });
        // Add your own marker
        const userMarker = createCustomMarker(userData.profile_picture);
        new mapboxgl.Marker(userMarker)
          .setLngLat([pos.longitude, pos.latitude])
          .addTo(mapRef.current)
          .getElement()
            .addEventListener('mouseenter', () => {
              popup
                .setLngLat([pos.longitude, pos.latitude])
                .setHTML(`<strong>You</strong>`)
                .addTo(mapRef.current);
            });

        userMarker.addEventListener('mouseleave', () => {
          popup.remove();
        });

          
    
        // Add markers for friends with popups
        friends_data.forEach((friend) => {
          const friendMarker = createCustomMarker(friend.profile_picture);
          const markerElement = new mapboxgl.Marker(friendMarker)
            .setLngLat([friend.longitude, friend.latitude])
            .addTo(mapRef.current);

          // Add hover event listeners
          friendMarker.addEventListener('mouseenter', () => {
            popup
              .setLngLat([friend.longitude, friend.latitude])
              .setHTML(`<strong>${friend.username}</strong>`)
              .addTo(mapRef.current);
          });

          friendMarker.addEventListener('mouseleave', () => {
            popup.remove();
          });
        });

      });
  

      return () => {
        if (mapRef.current.getLayer('friends')) {
          mapRef.current.removeLayer('friends');
        }
        if (mapRef.current.getSource('friends-source')) {
          mapRef.current.removeSource('friends-source');
        }
        if (mapRef.current) {
          mapRef.current.remove();
        }
      }
    }
    catch(err) {
      console.error("error: ", err);
    }
  }
    init();
  }, [])

  return (
    <>
      <div id='map-container' ref={mapContainerRef}/>
    </>
  )
}

export default GeolocationComponent