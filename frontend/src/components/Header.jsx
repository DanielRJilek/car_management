import Logo from './Logo';
import { useNavigate } from 'react-router';

function Header() {
    const navigate = useNavigate();
    return (
        <div id='header'>
            <Logo></Logo>
            <div id='header-menu'>
                
            </div>
            
        </div>
    );
}

export default Header