import React, { useState,useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "./skateboard-parks.json";
import 'mapbox-gl/dist/mapbox-gl.css';

const GeolocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 10
  });
  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  
  /* <div>
      <h1>Geolocation with Firebase</h1>
      <button onClick={getLocation}>Get Location</button>
      {location && (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
      {error && <p>Error: {error}</p>}
    </div>*/


    /*
      {parkDate.features.map(park => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }}
            >
              <img src="/skateboarding.svg" alt="Skate Park Icon" />
            </button>
          </Marker>
        ))}

        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div>
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        ) : null}
    */

  return (
    
      <ReactMapGL 
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        marker's here
      </ReactMapGL>
      
  );
};

export default GeolocationComponent;
