import "./eventPost.scss"
// keeping it very simple for now with only one type of post. can do video format and text format later on 

import { Link } from "react-router-dom"


// this part should be dynamic once you make event posts the main page take in data from the API dynamically, 
// make sure the wording is consistent, if not change the backend so that it is else things won't show 
// up on the front end properly 

export const EventPost = ({eventpost}) => {
  return (
    <div className='eventpost'> 
        <div className="user">
          <div className="information">
            <img src={eventpost.picture} alt="" />
            <div className="username">
              <Link to={`/profile/${eventpost.id}`} style={{textDecoration: "none"}}>
              <span>{eventpost.name}</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="content">
          <p> {eventpost.description}</p>
          <img src={eventpost.img} alt="" />
        </div>
    </div>
  )
}
