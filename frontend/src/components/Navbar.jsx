import {Link} from "react-router-dom";
import useLogout from "../hooks/useLogout.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateContext } from "../context/authenticateContext";
import shoppingCart from "../assets/shopping-cart.png";
const Navbar = () => {
    const { logout } = useLogout();
    const navigate = useNavigate();
    
    const logoutHandler = () => {
        logout();
        navigate("/");
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
                            <li>Home</li>
                            <li>Products</li>
                            <li><a href="/cart">Cart</a></li>
                            <li className="logout-button">    
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