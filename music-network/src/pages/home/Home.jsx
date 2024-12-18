import VideoAd from "../../components/VideoAd/VideoAd"
import Events from "../../components/events/Events"
import Share from "../../components/Share/Share"
import "./home.scss"


const Home = () => {
    return (
        <div className="home">
            <VideoAd/>
            <Share/>
            <Events/>
            <POsts/>
        </div>
    )
}

export default Home 



