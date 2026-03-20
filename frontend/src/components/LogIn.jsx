import { ClipLoader } from "react-spinners";
import { IconContext } from 'react-icons';
import { IoAlertCircle } from "react-icons/io5";
import { useState, useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { useNavigate } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

function LogIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password}),
            });
            setLoading(false);
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
            }
            else {
                const {accessToken, user} = await response.json();
                user.setUsername(user.name || user.email);
                user.setUserID(user.id.toString());
                auth.setAccessToken(accessToken);
                
                navigate('/');
            }
        } 
        catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return (<ClipLoader></ClipLoader>)
    }
    else {
        return (
            <form className='login-form' onSubmit={handleSubmit}>
                <label for="username">Username</label>
                <input className='login-input' type="text" id="username" name="username"></input>
                <label for="password">Password</label>
                <input className='login-input' type="password" id="password" name="password"></input>
                <button type="submit">Log In</button>
                <a href='/signup'>Create Account</a>
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

export default LogIn