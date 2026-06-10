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
            <button onClick={handleSignup}>Sign up as customer</button>
            <button onClick={handleLogin}>Login as customer</button>
        </>
    )
}

export default CustomerHomePage;