import { useRef, useEffect,useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import 'mapbox-gl/dist/mapbox-gl.css';
import './testing.css'
import {useContext} from "react";
import AuthContext from "../../authentication/AuthContext";

function GeolocationComponent() {

  const mapRef = useRef()
  const mapContainerRef = useRef()
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const {auth, login_auth, userData, set_user_detail} = useContext(AuthContext); 


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
    }
    
    return { latitude, longitude };
  } catch (err) {
    setError(err.message);
  }
};

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

  

  useEffect(() => {
    const init = async() =>{ 

      const addPin = (longitude, latitude) => {
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude]) // Set the marker's position
          .addTo(mapRef.current); // Add the marker to the map
      };

      let pos  = await getLocation();
      mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXN0MDYwMSIsImEiOiJjbTVreWVnNHYxcGJ2MmlzN3ZwY3cwb3g3In0.qk6JCU_FvvVC5QGmam0wvQ'
      let map = {};
      map = {
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center : [pos.longitude, pos.latitude], 
        zoom: 15.12}

      mapRef.current = new mapboxgl.Map(map);
      //addPin(-1.3973829489668161, 50.93338242200269);  // long, lat
      //addPin(pos.longitude, pos.latitude); 

      let locations = [
        { id: 1, longitude: -1.3973829489668161, latitude: 50.93338242200269, text: "Location 1: A cool place" },
        { id: 2, longitude: pos.longitude, latitude: pos.latitude, text: "Location 2: Another cool spot" }
      ]

      mapRef.current.on('load', () => {
        mapRef.current.addSource('places', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  description:
                    '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>'
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-1.3973829489668161, 50.93338242200269]
                }
              },
              {
                type: 'Feature',
                properties: {
                  description:
                    '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a Mad Men Season Five Finale Watch Party, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>'
                },
                geometry: {
                  type: 'Point',
                  coordinates: [pos.longitude, pos.latitude]
                }
              },
              {
                type: 'Feature',
                properties: {
                  description:
                    '<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a Big Backyard Beach Bash and Wine Fest on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.</p>'
                },
                geometry: {
                  type: 'Point',
                  coordinates: [-77.090372, 38.881189]
                }
              }        
            ]
          }
        });
  
        mapRef.current.addLayer({
          id: 'places',
          type: 'circle',
          source: 'places',
          paint: {
            'circle-color': '#4264fb',
            'circle-radius': 15,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
  
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });
  
        mapRef.current.on('mouseenter', 'places', (e) => {  // popup when hover
          mapRef.current.getCanvas().style.cursor = 'pointer';
  
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;
  
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
  
          popup.setLngLat(coordinates).setHTML(description).addTo(mapRef.current);
        });
  
        mapRef.current.on('mouseleave', 'places', () => { // disappear when move away
          mapRef.current.getCanvas().style.cursor = '';
          popup.remove();
        });
      });
  

      return () => {
        mapRef.current.remove()
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