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
        <form className="login" onSubmit={handleSubmit}>
            <label>Email/Username: </label>
            <input type="text" onChange={(e) => setEmailUser(e.target.value)} value={EmailUser}/>

            <label>Password: </label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <button>Submit</button>
            {error && <div className="form-error-msg">{error}</div>}
        </form>
    )
}

export default Login;