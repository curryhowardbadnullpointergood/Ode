import "./notification.scss"
import Organisation_Image from "../../assets/org_image.jpg"

// id her is the id of the user, and we get the notifications of the user 
// from the database 
// make changes as needed to get this to work, I can't spell out how to code evey function figure it out make it work 


const notification = () => {

    // this is temporary, make sure to make this dynamic in the future 
    const notification = [
        {
            id: 12, // this is the id of the user 
            name: "Concerto",// this is the name of the organisation organising the event 
            notification: " This should be an ai generated notification about the event in question: blah blah blah blah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blah ",
            image: Organisation_Image, // this should be organisation image query with name 

        }
    ]

  return (
    <div className='notification'>
        
        {notification.map(notifi => (
            <div className="organisation" key={notifi.id}>
                <div className="info">
                    <img src={notifi.image} alt="" />
                    <span> {notifi.name}</span>
                </div>
                <div className="text">
                    <p>{notifi.notification}</p>
                </div>
            </div>
        ))}
        
    </div>
  )
}

export default notification