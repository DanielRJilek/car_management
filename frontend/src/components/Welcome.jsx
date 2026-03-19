import { useNavigate } from 'react-router';
import dealershipImage from '../assets/dealership.jpg';
import '../css/welcome.css';

function Welcome() {
    const navigate = useNavigate();
    const login = () => {
        navigate('/auth');
    }

    return (
        <div id='welcome-page'>
            <h1>Welcome to Car Management</h1>
            <p className='welcome-summary'>
                This software helps you track your dealership inventory, manage availability, and maintain sales records.
                Add, update, delete vehicles, and monitor totals with an easy dashboard interface.
            </p>
            <div className='welcome-summary-list'>
                <p><strong>Key operations include:</strong></p>
                <p>Create new cars</p>
                <p>Update new sales</p>
                <p>Delete cars</p>
                <p>Read all sales</p>
                <p>Read all cars</p>
            </div>

            <div className='hero-image'>
                <img src={dealershipImage} alt='Dealership' />
            </div>

            <div id='login-center'>
                <button onClick={login}>Log In</button>
            </div>
        </div>
    );
}

export default Welcome