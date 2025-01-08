import { Link,useNavigate } from "react-router-dom"
import "./login.scss"
import AuthContext from "../../authentication/AuthContext";
import HandleLogin from "../../apiFunctions/HandleLogin";
import {useContext} from "react";



const Login = () => {

    const {auth, login_auth, userData, set_user_detail} = useContext(AuthContext); // authentication with AuthContext
    const navigate = useNavigate(); // Hook for navigation
    //console.log(auth.isLoggedIn);
    return(
        <div className="login"> 

        {/* <video autoplay muted loop className='backvideo'  id="myVideo">
         <source src='../../assets/sea.mp4' type="video/mp4"/>
        </video> */}


        <div className="box">


            
        <div className="left">
            <h1> Ode! </h1>
            <p> Welcome to Ode! Here you can find interesting events to go to and meet people with similar interests. Create an account and start your musical adventure!</p>
            <span> Click here to register! </span>
            <Link to = '/register'>
                <button>Register</button>
            </Link>
            

        </div>

        <div className="right">
            <h1> Login</h1>
            <form method="post" onSubmit={e => HandleLogin(e,navigate, login_auth, set_user_detail)}> 
                <input type="text" placeholder="Enter Username: "  name="username"/>
                <input type="password" placeholder="Enter Password: "  name="password"/>
                <button>Login</button>
                {/* in  the future it goes without saying this wording needs to be better optimised, for the profs*/}
            </form>
        </div>
        </div>
        </div>
    )
}

export default Login

