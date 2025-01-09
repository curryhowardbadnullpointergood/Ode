import React, { useEffect, useContext,useState } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../authentication/AuthContext";
import HandleCreateEvent from '../../apiFunctions/HandleCreateEvent';
import "./organisation.scss";
import DatePicker  from "react-datepicker";
import TimePicker from 'react-time-picker';

import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
/* 
So we need organisation name input, this is done in the login stage I guess, need to tweak it for organisation 
support i guess, shouldn't be too bad 
need an add event dic, where organiser can add an event, 
so this takes in, text description, image, possibly video not compulsory though, 
genre, location, etc. text input field, gets uploaded to the backend 
doesn't need to look pretty, so will code this quick. 


link submit buttont to backend function
*/

const Organisation = () => {
    const navigate = useNavigate();
    const { auth, userData } = useContext(AuthContext);
    const currentUser = auth.token; // Get username from userData instead of localStorage
    let today = new Date();
    today.setDate(today.getDate() - 1);

    const minDate= new Date(today);
    const maxDate= new Date("12/12/2030");

    const [startDate, setStartDate] = useState(new Date());
    const [start_value_time, onChange] = useState('10:00');
    const [endDate, setEndDate] = useState(startDate);
    const [end_value_time, onEndChange] = useState('10:00');

    
    const genreList = ["rock", "pop", "jazz", "classical", "electronic", "hip-hop", "metal", "indie", "folk",
        "r&b", "opera", "piano", "musical theatre", "strings", "guitar", "drums", "bass", "vocals",
        "production", "composition"]
 
    useEffect(() => {
        if (auth.token !== null){
            if (auth.account_type !== "admin" ) {
                console.log("Not an admin, redirecting. Account type:", auth.account_type);
                navigate('/login');
            }
        }
        
    }, [auth.account_type, navigate]);

    const toggleGenre = (item) => { // function to add the favourite genre 
        setGenre((prevFavorites) =>
          prevFavorites.includes(item)
            ? prevFavorites.filter((fav) => fav !== item) // Remove if already selected
            : [...prevFavorites, item] // Add if not selected
        );
      };

    const setEndTime = (time) => {
        if (startDate === endDate){
            if(start_value_time > time){
                alert("cannot set end time before start time for the same day!");
            }
            else{
                onEndChange(time);
            }
        }
        else{
            onEndChange(time);
        }
    }   

    const handleImgFile= (e) => {
        console.log(e.target.files[0]);
        let kk = URL.createObjectURL(e.target.files[0]);
        let k = e.target.files[0];
        setFile(k);
        setFile_url(kk);
    }

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState(); // storing the file
    const [file_url, setFile_url] = useState(); // storing the file
    const [genre, setGenre] = useState([]);
    // date time validator
    const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
    const isValidTime = (timeStr) => /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(timeStr);

    // Mapping field names to their respective update functions
    const fieldUpdaters = {
        name: setName,
        description: setDescription,
        location: setLocation,
        price: setPrice
    };

    // for input field to write value into hook
    const handleChange = (e) => {
        const { name, value } = e.target; // Extract field name and value

        if (fieldUpdaters[name]) {
          fieldUpdaters[name](value); // Call the appropriate updater function
        }
      };
    
    const handlePriceChange = (e) => { // can't handle - sign in the middle tho
        const value = e.target.value;

        // Allow only positive numbers or an empty string
        if (value === "" || /^[0-9]*$/.test(value)) {
            setPrice(value);
        }
        else{
            setPrice(0);
        }
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        let object_to_send ={};
        if (name === ""){
            alert("Event name required");
        }
        else if (description === ""){
            alert("Description required");
        }
        else if (genre.length === 0){
            alert("At least one Genre required");
        }
        else{ // passing all check

            //switching date format to ISO 8601
            let temp_start_date = startDate.toISOString().split("T")[0];
            let temp_end_date = endDate.toISOString().split("T")[0];
            let start_dateTime = new Date(`${temp_start_date}T${start_value_time}:00`).toISOString();
            let end_dateTime = new Date(`${temp_end_date}T${end_value_time}:00`).toISOString();
           

            object_to_send = {
                "admin" : currentUser,
                "name" : name,
                "description" : description,
                "picture" : file,
                "location" : location,
                "start_time" : start_dateTime,
                "end_time" : end_dateTime,
                "genres" : genre,
                "prices" : price
            }
            console.log("object_to_send: ", object_to_send);
            HandleCreateEvent(object_to_send,navigate);
        }
    }


    return (
        <div className="organisation">
            <h1>Event Set Up </h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <span> Event name </span>
                <input className="input_word" type="text" name="name" value={name} onChange={handleChange} placeholder="Event name" />
                
                <span> Event description</span>
                <textarea className="input_word" name="description" value={description} rows="4" cols="80" onChange={handleChange} placeholder="Event description" ></textarea>
                <div className ="upload_picture">
                    <span> Upload event image! </span>
                    <input className="input_word" type="file" name="picture" onChange={handleImgFile} accept="image/*" />
                    <img src={file_url} />
                </div>
                <span> Upload Address of location! </span>
                <input className="input_word" type="text" name="location" value={location} onChange={handleChange} placeholder="Location" />
                <div className ="upload_picture">
                <div className="timeDate">
                    <span> Start Date and time</span>
                    <DatePicker  
                        minDate={minDate}
                        maxDate={maxDate}
                        selected={startDate} 
                        onChange={(date) => {
                            setStartDate(date);
                            setEndDate(date);

                        }} />

                    <TimePicker disableClock={true} onChange={(time) => onChange(time)} value={start_value_time} />
                </div>
                <div className="timeDate">
                    <span> End Date and time</span>
                    <DatePicker  
                        minDate={startDate}
                        maxDate={maxDate}
                        selected={endDate} 
                        onChange={(date) => setEndDate(date)} />

                    <TimePicker  disableClock={true} onChange={(time) => setEndTime(time)} value={end_value_time} />
                </div>
                </div>

                <span> Price of tickets (in £) </span>
                <input className="input_word" type="number" name="price" value={price} min="0" 
                    onChange={(e) => handlePriceChange(e)}  step="0.01" placeholder="Ticket price" />  
                <span> Upload Genre! </span> {/*do it with button*/}

                <div className="genreList">
                    {genreList.map((item) => (
                        <button 
                            type="button" 
                            key={item} 
                            onClick={() => toggleGenre(item)}
                            className={`genre-button ${genre.includes(item) ? "active" : ""}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <button className='submitButton' type="submit">Submit</button>
            </form>
        </div>
    )
}


export default Organisation