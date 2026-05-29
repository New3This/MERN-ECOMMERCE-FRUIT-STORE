import {Link} from "react-router-dom";
import useLogout from "../hooks/useLogout.jsx";

const Navbar = () => {
    const { logout } = useLogout();
    const logoutHandler = () => {
        logout();
    }

    return (
        <header>
            <div className="navbar">
                <Link to="/" className="navbar-link">
                    Admin
                </Link>
                <Link to="/login" className="navbar-link">
                    Login
                </Link>    
                <Link to="/signup" className="navbar-link">
                    Sign Up
                </Link>   
                <button onClick={logoutHandler} className="navbar-link">
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Navbar;