import "./search.scss";
import { useLoaderData, useParams, withRouter } from "react-router-dom";
import { Link } from "react-router-dom"
import {useState, useContext} from "react";
import HandleUserInfo from "../../apiFunctions/HandleUserInfo";
import AuthContext from "../../authentication/AuthContext";
import placeholder from "../../assets/placeholder.jpg"

const Search = (props) => {
    //const params = useParams();
	//const [userData, setUserData] = useState({});
    //let exist = true;
    //const response = HandleUserInfo(params.id,setUserData);
    //const {auth, logout_auth} = useContext(AuthContext);

    function search_entity(e){ // display of search entity 
        return (
            <div>

            </div>
        )
    }

    return( // main return function
        <div>

        </div>
    )
}

export default Search

