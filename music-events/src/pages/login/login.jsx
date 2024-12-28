import { Link,useNavigate } from "react-router-dom"
import "./login.scss"
import HandleLogin from "../../apiFunctions/HandleLogin";
const Login = () => {
    const navigate = useNavigate(); // Hook for navigation
    return(
        <div className="login"> 
        <div className="box">
            
        <div className="left">
            <h1> Welcome! </h1>
            <p> A bit about our app! Something like oh this is a music app about events, needs to be catchy and short, but informative and formal.</p>
            <span> Click here to register! </span>
            <Link to = '/register'>
                <button>Register</button>
            </Link>
            

        </div>

        <div className="right">
            <h1> Login</h1>
            <form method="post" onSubmit={e => HandleLogin(e,navigate )}> 
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

