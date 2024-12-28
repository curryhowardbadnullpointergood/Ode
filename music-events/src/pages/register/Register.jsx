import { useState } from "react";
import "./register.scss";
import {Link,useNavigate} from "react-router-dom";
import handleRegister from "../../apiFunctions/HandleRegister";
function Register() {


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [pw_confirmation, setPw_confirmation] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="grad">
        <div className='centerBlock'>
            <div className='reigsterPage'>
                <div className='regBlock'>
                    <h1>Register</h1>
                    <form method="post" onSubmit={e => handleRegister(e,navigate)} className="regForm">
                        <input type='username' onChange={e => setUserName(e.target.value)}
                            name="username" placeholder="Enter Username:" />
                        <input type='email' onChange={e => setUserName(e.target.value)}
                            name="email_address" placeholder="Enter Email:" />
                        <input type='password'  onChange={e => setPassword(e.target.value)}
                            name="password" placeholder="Enter Password:" />
                        <input type='password'  onChange={e => setPassword(e.target.value)}
                        name="confirmed_password" placeholder="Confirm Password:" />
                        <button  type="submit" >Confirm</button>
                    </form>
                </div>
            </div>
            <div className="login2">
                <h1>Welcome!</h1>
                <div>
                    <p>Here's your portal into the world of music fantasy. Just need a simple account and you are all set!</p>
                    <h4>Already have an account?</h4>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                    
                </div>
            </div>
        </div>
        
    </div>
  );
}
export default Register;