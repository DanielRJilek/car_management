import {useNavigate} from 'react-router'

function Welcome() {
    const navigate = useNavigate();
    const login = () => {
        navigate('/auth');
    }
    const about = () => {
        navigate('/about')
    }
    return (
        <div id='play-now'>
            <button onClick={login}>Log In</button>
            <button onClick={about}>About</button>
        </div>
    );
}

export default Welcome