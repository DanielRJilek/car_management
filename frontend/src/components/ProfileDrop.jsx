import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';

function ProfileDrop() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    
    const handleLogout = () => {
        // Clear authentication data
        auth.setAccessToken(null);
        user.setUsername("");
        user.setUserID("");
        localStorage.removeItem("token");
        
        // Navigate to home
        navigate('/');
    };
    
    const handleLogin = () => {
        navigate('/auth');
    };
    
    return (
        <div id='profile-drop'>
            {auth.accessToken ? (
                <div className='profile-container'>
                    <span className='profile-username'>{user.username}</span>
                    <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <button className='login-btn' onClick={handleLogin}>Login</button>
            )}
        </div>
    );
}

export default ProfileDrop;
