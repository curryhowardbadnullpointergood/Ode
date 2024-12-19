import { useState } from "react";
import "./register.scss";
import {Link } from "react-router-dom";
function Register() {
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
    <div className="grad">
        <div className='centerBlock'>
            <div className='reigsterPage'>
                <div className='regBlock'>
                    <h1>Register</h1>
                    <form method="post" onSubmit={handleSubmit} className="regForm">
                        <input type='username' onChange={e => setUserName(e.target.value)}
                            name="myInput" placeholder="Enter Username:" />
                        <input type='username' onChange={e => setUserName(e.target.value)}
                            name="myInput" placeholder="Enter Email:" />
                        <input type='password'  onChange={e => setPassword(e.target.value)}
                            name="myInput" placeholder="Enter Password:" />
                        <button  type="submit">Confirm</button>
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