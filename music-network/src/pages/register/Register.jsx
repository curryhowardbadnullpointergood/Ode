import { useState } from "react";
import "./register.scss";
import {Link } from "react-router-dom";
function Login() {
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
    
        // pass data back to backend
        fetch('/some-api', { method: form.method, body: formData });
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
      }
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

  return (
    <container className="grad">
        <div className='centerBlock'>
            <div className='loginPage'>
                <div className='loginBlock'>
                    <h2>Sign up</h2>
                    <form method="post" onSubmit={handleSubmit} className="loginForm">
                        <div>
                            <div>
                            <label>
                                <h4>User Name</h4>
                            </label>
                            </div>
                            <div>
                            <input type='username' onChange={e => setUserName(e.target.value)}
                                name="myInput" placeholder="username" />
                            </div>
                        </div>
                        <div>
                            <div>
                            <label>
                                <h4>email</h4>
                            </label>
                            </div>
                            <div>
                            <input type='username' onChange={e => setUserName(e.target.value)}
                                name="myInput" placeholder="e.g: example@gmail.com" />
                            </div>
                        </div>
                        <div>
                            <label>
                                <h4>Password</h4>
                                <h6>The password should be at least 10 characters long with a combination of uppercase letters, lowercase letters, numbers, and symbols </h6> 
                            </label>
                            <div><input type='password'  onChange={e => setPassword(e.target.value)}
                                name="myInput" defaultValue="" /></div>
                        </div>

                        <button className="confirmButton" type="submit">Confirm</button>
                        
                    </form>
                    </div>
            </div>
            <div className="signup">
                <div>
                    <h2>Welcome </h2>
                    <h4>Already have an account?</h4>
                    <Link to="../login">
                        <button className="confirmButton">Sign In</button>
                    </Link>
                    
                </div>
            </div>
        </div>
        
    </container>
  );
}

export default Login;