import "./organisation.scss"

/* 
So we need organisation name input, this is done in the login stage I guess, need to tweak it for organisation 
support i guess, shouldn't be too bad 
need an add event dic, where organiser can add an event, 
so this takes in, text description, image, possibly video not compulsory though, 
genre, location, etc. text input field, gets uploaded to the backend 
doesn't need to look pretty, so will code this quick. 


link submit buttont to backend function
*/

const organisation = () => {
  return (
    <div className="organisation">
    <h1> ORGANISATION ACCOUNT </h1> 
    <span> Event discription</span>
    <input type="text" placeholder="Event discription" />
    <button> Submit </button> 
    <span> Upload event image! </span>
    <input type="file" accept="image/*" />
    <span> Upload Location! </span>
    <input type="text" placeholder="Location" />
    <span> Upload Genre! </span>
    <input type="text" placeholder="Music genre!" />
    
    </div>
  )
}

export default organisation