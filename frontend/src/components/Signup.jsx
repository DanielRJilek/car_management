import {useNavigate} from 'react-router'
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { ClipLoader } from "react-spinners";
import { IconContext } from 'react-icons';
import { IoAlertCircle } from "react-icons/io5";
const API_URL = import.meta.env.VITE_API_URL;

function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password1 = e.target[1].value;
        const password2 = e.target[2].value;
        console.log(username, password1, password2);
        setLoading(true);
        try {
            // Single call directly to auth/signup - this handles everything
            const response = await fetch(`${API_URL}/auth/signup`, {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password: password1}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                setLoading(false);
                return;
            }
            
            // Now auto-login after signup
            const loginResponse = await fetch(`${API_URL}/auth/login`, {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password: password1}),
            });
            
            if (!loginResponse.ok) {
                setError("Account created, but login failed. Please log in manually.");
                setLoading(false);
                return;
            }
            
            const {accessToken, user: userData} = await loginResponse.json();
            user.setUsername(userData.username);
            user.setUserID(userData.id.toString());
            auth.setAccessToken(accessToken);
            navigate('/cars');
        } 
        catch (error) {
            console.log(error);
            setError("An error occurred during signup");
            setLoading(false);
        }
    }
    if (loading) {
        return (<ClipLoader></ClipLoader>)
    }
    else {
        return (
            <form className='login-form' onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input className='login-input' type="text" id="username" name="username"></input>
                <label htmlFor="password">Password</label>
                <input className='login-input' type="password" id="password" name="password"></input>
                <label htmlFor="confirm-password">Confirm Password</label>
                <input className='login-input' type="password" id="confirm-password" name="confirm-password"></input>
                <button type="submit">Create an account</button>
                <div>
                    <span>Already have an account? </span>
                    <a href='/auth'>Login</a>
                </div>
                
                <div className='error'>
                    {(error && error != null) ? 
                    <IconContext.Provider value={{className:'icon'}}>
                        <IoAlertCircle ></IoAlertCircle>
                        {error}
                    </IconContext.Provider>
                    : ''}
                </div>
                
            </form>
        )
    }
}

export default SignUp