import { useNavigate, useLocation } from "react-router-dom";

const CustomerHomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const Arole = location.state?.role;

    const handleSignup = () => {
        navigate("/Signup", {state : { role: "customer" } });
    }
    const handleLogin = () => {
        navigate("/Login", {state : { role: "customer" } });
    }

    return (
        <>
            <button className="back-arrow" onClick={() => navigate(-1)}>
            &larr;
            </button>
            <div className="customer-visit-page">
                <div id="visit-question">As customer, would you like to?</div>
                <div className="visit-buttons">
                    <button onClick={handleSignup}>Sign Up</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            </div>
        </>
    )
}

export default CustomerHomePage;