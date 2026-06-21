import {Link} from "react-router-dom";
import useLogout from "../hooks/useLogout.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateContext } from "../context/authenticateContext";
import shoppingCart from "../assets/shopping-cart.png";
import settings from "../assets/settings.png";

const Navbar = () => {
    const { logout } = useLogout();
    const navigate = useNavigate();
    
    const logoutHandler = () => {
        logout();
        navigate("/");
    }

    const handleSettings = () => {
        navigate("/settings");
    }
    const { user } = useContext(authenticateContext);

    return (
        <header>
            <div className="navbar">
                <nav>
                    {!user && (
                        <>
                            <Link to="/" className="navbar-link">
                                Join Us
                            </Link>   
                        </>
                    )}
                    {user && (
                        <ul className="navbar-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/product">Products</a></li>
                            <li><a href="/cart">Cart</a></li>
                            <li className="logout-button">
                                <img src={settings} onClick={handleSettings} alt="settings-icon" className="settings-icon"></img>
                                <button onClick={logoutHandler} className="navbar-link">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;