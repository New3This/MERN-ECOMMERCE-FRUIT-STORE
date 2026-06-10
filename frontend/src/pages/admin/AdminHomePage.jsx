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
            <button onClick={handleSignup}>Sign up as admin</button>
            <button onClick={handleLogin}>Login as admin</button>
        </>
    )
}

export default AdminHomePage;