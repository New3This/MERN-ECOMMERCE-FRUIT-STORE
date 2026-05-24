import {Link} from "react-router-dom";

const Navbar = () => {
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
            </div>
        </header>
    )
}

export default Navbar;