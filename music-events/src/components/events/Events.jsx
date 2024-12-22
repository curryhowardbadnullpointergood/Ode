import "./Events.scss"
import Hahn from "../../assets/Hahn.jpg"
import HahnProfile from "../../assets/HahnProfile.jpeg"

// going to hard code this in for now, but API should be able to handle this in the future 

const Events = () => {

    // temporary dummy data, link this up to the API
    // it goes without saying, that if we don not have 5 event videos, 
    // make this dynamic and show them less events stories 

    const events = [
        {
            id: 1, // unique id for player 
            username: "Hilary Hahn",
            img: Hahn,

        },
        {
            id: 2, // unique id for player 
            username: "Hilary Hahn",
            img: Hahn,

        },
        {
            id: 3, // unique id for player 
            username: "Hilary Hahn",
            img: Hahn,

        },
        {
            id: 4, // unique id for player 
            username: "Hilary Hahn",
            img: Hahn,

        },
        {
            id: 5, // unique id for player 
            username: "Hilary Hahn",
            img: Hahn,

        },

    ]

    return (
        <div className="Events">
            <div className="event">
                    <img src={HahnProfile} alt="" />
                    <span>{"Legendary Violinist!"}</span>

                </div>
            {events.map(event =>(
                <div className="event">
                    <img src={event.img} alt="" />
                    <span>{event.username}</span>

                </div>
            ))}
        </div>
    )
}


export default Events 
