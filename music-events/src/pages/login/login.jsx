import "./login.scss"

const Login = () => {
    return(
        <div className="login"> 
        <div className="box">
            
        <div className="left">
            <h1> Welcome! </h1>
            <p> A bit about our app! Something like oh this is a music app about events, needs to be catchy and short, but informative and formal.</p>
            <span> Click here to register! </span>
            <button>Register</button>

        </div>

        <div className="right">
            <h1> Login</h1>
            <form> 
                <input type="text" placeholder="Enter Username: "/>
                <input type="password" placeholder="Enter Password: "/>
                <button>Login</button>
                {/* in  the future it goes without saying this wording needs to be better optimised, for the profs*/}
            </form>
        </div>

        </div>
        </div>
    )
}

export default Login

