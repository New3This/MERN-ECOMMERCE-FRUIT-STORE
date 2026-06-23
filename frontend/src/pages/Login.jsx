import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
    const [EmailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    
    const location = useLocation();
    const role = location.state?.role;
    const navigate = useNavigate();

    const { login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await login(EmailUser, EmailUser, password, role);
            if (role === "customer") {
                navigate("/CustomerProductPage");
            } else if (role === "admin") {
                navigate("/AdminProductPage");
            }
            
        } catch (err) {
            setError(err.message);
        }
    }

    return (
            <>
                <button className="back-arrow" onClick={() => navigate(-1)}>
                &larr;
                </button>
                <div className="form-container">
                    <form className="login" onSubmit={handleSubmit}>
                        <p className="login-title">Welcome back</p>
                        <input type="text" placeholder="Email/Username" onChange={(e) => setEmailUser(e.target.value)} value={EmailUser}/>
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <button className="login-button">Login</button>
                        {error && <div className="form-error-msg">{error}</div>}
                    </form>
                </div>
            </>
    )
}

export default Login;