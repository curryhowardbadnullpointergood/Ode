import "./profile.scss"


// this should be linked back to the profile of the person in question 
// background image and profile pic 
// have a default background image otherwise, these trees work fine for now 
// else show their background image 
// name needs to be dynamic as well these are dummy values 
// make bio dynamic 

import back from "../../assets/profile_background.jpg"
import Sophie from "../../assets/anne-sophie-mutter_profile.jpg"

const profile = () => {
    
    return(
        <div className="profile"> 
        <div className="profileimages">
            <img src={back} alt="" className="background" />
            <img src={Sophie} alt="" className="profile" />
        </div>
        <div className="personalinformation">
            <span> Anne Sophie Mutter</span>  

            <div className="bio">
                <p>
                Anne-Sophie Mutter (born 29 June 1963) is a German violinist. Born and raised in Rheinfelden, Baden-Württemberg, Mutter started playing the violin at age five and continued studies in Germany and Switzerland. She was supported early in her career by Herbert von Karajan and made her orchestral debut with the Berlin Philharmonic in 1977. Since Mutter gained prominence in the 1970s and 1980s, she has recorded over 50 albums, mostly with the Deutsche Grammophon label, and performed as a soloist with leading orchestras worldwide and as a recitalist. Her primary instrument is the Lord Dunn–Raven Stradivarius violin.

Mutter's repertoire includes traditional classical violin works from the Baroque period to the 20th century, but she also is known for performing, recording, and commissioning new works by present-day composers. As an advocate of contemporary music, she has had several works composed especially for her, by Thomas Adès, Unsuk Chin, Sebastian Currier, Henri Dutilleux, Sofia Gubaidulina, Witold Lutosławski, Norbert Moret, Krzysztof Penderecki, André Previn, Wolfgang Rihm, Jörg Widmann, and John Williams.

Mutter has received numerous awards and prizes, including four Grammy Awards (1994, 1999, 2000, and 2005), Echo Klassik awards (2009, 2014), the Grand Decoration of Honour of Austria (2007), the Grand Cross Order of Merit of the Federal Republic of Germany (2009), France's Legion of Honour (2009), Spain's Gold Medal of Merit in the Fine Arts (2016), Romania's Grand Cross National Order of Merit (2017), Poland's Gold Medal for Merit to Culture – Gloria Artis (2018), Japan's Praemium Imperiale (2019), the Polar Music Prize (2019), and holds honorary memberships at the Royal Academy of Music (1986) and American Academy of Arts and Sciences (2013).

Mutter founded the Association of Friends of the Anne-Sophie Mutter Foundation e.V. in 1997 and the Anne-Sophie Mutter Foundation in 2008, which support young string musicians. She frequently gives benefits concerts and, since 2021, has been the president of the German Cancer Aid. 
                </p>
            </div>
        </div>
        </div>
    )
}

export default profile

