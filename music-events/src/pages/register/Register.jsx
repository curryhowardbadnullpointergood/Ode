import { useState } from "react";
import "./register.scss";
import {Link,useNavigate} from "react-router-dom";
import handleRegister from "../../apiFunctions/HandleRegister";
function Register() {
    // function handleSubmit(e) {
    //     // Prevent the browser from reloading the page
    //     e.preventDefault();
    
    //     // Read the form data
    //     const form = e.target;
    //     const formData = new FormData(form);
    
    //     // pass data back to backend
    //     fetch('/some-api', { method: form.method, body: formData });
    
    //     // Or you can work with it as a plain object:
    //     const formJson = Object.fromEntries(formData.entries());
    //     console.log(formJson);
    //   }
    // const [userName, setUserName] = useState('');
    // const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="grad">
        <div className='centerBlock'>
            <div className='reigsterPage'>
                <div className='regBlock'>
                    <h1>Register</h1>
                    <form method="post" onSubmit={e => handleRegister(e,navigate)} className="regForm">
                        <input type='username' name="username" placeholder="Enter Username:" />
                        <input type='email' name="email_address" placeholder="Enter Email:" />
                        <input type='password' name="password" placeholder="Enter Password:" />
                        <input type='password' name="confirmed_password" placeholder="Confirm Password:" />
                        <button  type="submit" >Confirm</button>
                    </form>
                </div>
            </div>
            <div className="login2">
                <h1>Ode!</h1>
                <div>
                    <p>Welcome to the world of music fantasy. Just need an account and you are all set!</p>
                    <h4>Already have an account?</h4>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>

                    {/* Anna new start */}
                    <h4>Representing an organisation?</h4>
                    <Link to="/register-admin">
                        <button>Register Organisation</button>
                    </Link>
                    {/* Anna new end */}
                    
                </div>
            </div>
        </div>
        
    </div>
  );
}
export default Register;