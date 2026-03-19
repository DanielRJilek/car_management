import { ClipLoader } from "react-spinners";
import { IconContext } from 'react-icons';
import { IoAlertCircle } from "react-icons/io5";
import { useState } from "react";

function LogIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

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