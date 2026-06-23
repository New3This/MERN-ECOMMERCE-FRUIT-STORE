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
            user && (
                <header>
                    <div className="navbar">
                            <div className="navbar-links">

                                <div className="nav-left">
                                    <h2 className="logo-name">Storelio</h2>
                                </div>

                                <ul className="nav-middle">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/product">Products</a></li>
                                    <li><a href="/cart">Cart</a></li>
                                </ul>

                                <div className="nav-right">
                                    <img src={settings} onClick={handleSettings} alt="settings-icon" className="settings-icon"></img>
                                    <button onClick={logoutHandler} className="navbar-link">
                                        Logout
                                    </button>
                                </div>
                            </div>
                    </div>
                </header>
            )    
    )
}

export default Navbar;