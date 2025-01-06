import React, { useState,useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "./skateboard-parks.json";

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

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          saveLocationToFirestore(latitude, longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const saveLocationToFirestore = async (latitude, longitude) => {
    try {
      const userId = "user123"; // Replace with actual user ID (e.g., from Firebase Auth)
      await setDoc(doc(db, "locations", userId), {
        latitude,
        longitude,
        timestamp: new Date(),
      });
      console.log("Location saved to Firestore!");
    } catch (err) {
      console.error("Error saving location to Firestore:", err);
    }
  };
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
    <div>
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
      </div>
  );
};

export default GeolocationComponent;
