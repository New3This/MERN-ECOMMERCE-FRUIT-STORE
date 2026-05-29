import {Link} from "react-router-dom";
import useLogout from "../hooks/useLogout.jsx";
import { useContext } from "react";
import { authenticateContext } from "../context/authenticateContext";

const Navbar = () => {
    const { logout } = useLogout();
    const logoutHandler = () => {
        logout();
    }

    const { user } = useContext(authenticateContext);

    return (
        <header>
            <div className="navbar">
                <Link to="/" className="navbar-link">
                    Admin
                </Link>
                <nav>
                    {!user && (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>    
                            <Link to="/signup" className="navbar-link">
                                Sign Up
                            </Link>   
                        </>
                    )}
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <button onClick={logoutHandler} className="navbar-link">
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;