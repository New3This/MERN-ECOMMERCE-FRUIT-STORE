import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <header>
            <div className="navbar">
                <Link to="/" className="navbar-link">
                    Admin
                </Link>        
            </div>
        </header>
    )
}

export default Navbar;