import { useState } from "react";
import "./login.scss";
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
                    <h2>Sign in</h2>
                    <form method="post" onSubmit={handleSubmit} className="loginForm">
                        <div>
                            <div>
                            <label>
                                <h4>User Name or email </h4>
                                
                            </label>
                            </div>
                            <div>
                            <input type='username' onChange={e => setUserName(e.target.value)}
                                name="myInput" defaultValue="Some initial value" />
                            </div>
                        </div>
                        <div>
                            <label>
                                <h4>Password</h4>
                            </label>
                            <div><input type='password'  onChange={e => setPassword(e.target.value)}
                                name="myInput" defaultValue="" /></div>
                        </div>

                        <button className="confirmButton" type="submit">Submit form</button>
                        
                    </form>
                    </div>
            </div>
            <div className="signup">
                <div>
                    <h2>Welcome </h2>
                    <h4>Haven't have an account? </h4>
                    <button className="confirmButton">Signup</button>
                </div>
            </div>
        </div>
        
    </container>
  );
}

export default Login;