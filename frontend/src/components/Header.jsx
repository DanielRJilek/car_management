import { useNavigate } from 'react-router';
import Logo from './Logo';

function Header() {
    const navigate = useNavigate();
    return (
        <div id='header'>
            <Logo />
            <div id='header-menu'>
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/cars')}>Cars</button>
                <button onClick={() => navigate('/sales')}>Sales</button>
            </div>
        </div>
    );
}

export default Header