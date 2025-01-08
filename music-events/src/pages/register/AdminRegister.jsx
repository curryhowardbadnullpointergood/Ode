import {useNavigate, useSearchParams} from "react-router-dom";
import {Link} from "react-router-dom";
import handleAdminRegister from "../../apiFunctions/HandleAdminRegister";
import "./register.scss";
import {useEffect} from "react";

function AdminRegister() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (success === 'true') {
            alert('Registration successful!');
            navigate('/login');
        } else if (error) {
            alert(`Registration failed: ${error}`);
        }
    }, [searchParams, navigate]);

    return (
        <div className="grad">
            <div className='centerBlock'>
                <div className='reigsterPage'>
                    <div className='regBlock'>
                        <h1>Register Organisation</h1>
                        <form onSubmit={e => handleAdminRegister(e, navigate)} className="regForm">
                            <input type='text' name="organisation" placeholder="Enter Organisation Name:"/>
                            <input type='email' name="email_address" placeholder="Enter Email:"/>
                            <input type='password' name="password" placeholder="Enter Password:"/>
                            <input type='password' name="confirmed_password" placeholder="Confirm Password:"/>
                            <button type="submit">Register Organisation</button>
                        </form>
                    </div>
                </div>
                <div className="login2">
                    <h1>Welcome!</h1>
                    <div>
                        <p>Register your organisation to start creating and managing events!</p>
                        <h4>Already registered?</h4>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister;