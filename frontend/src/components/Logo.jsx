import "../css/Logo.css";
import imgPath from "./src/assets/dealership.jpg";

function Logo() {
    return <div className='logo' aria-hidden='true'>
        <img src={imgPath} alt="Dealership" />
    </div>;
}

export default Logo