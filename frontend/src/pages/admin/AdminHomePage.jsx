import { useNavigate } from "react-router-dom";

const AdminHomePage = () => {
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate("/SignUp", {state : { role: "admin" }});
    }
    const handleLogin = () => {
        navigate("/Login", {state : { role: "admin" }});
    }

    return (
        <>
            <button className="back-arrow" onClick={() => navigate(-1)}>
                &larr;
            </button>
            <div className="customer-visit-page">
                <div id="visit-question">As admin, would you like to?</div>
                <div className="visit-buttons">
                    <button onClick={handleSignup}>Sign up</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            </div>
        </>
    )
}

export default AdminHomePage;