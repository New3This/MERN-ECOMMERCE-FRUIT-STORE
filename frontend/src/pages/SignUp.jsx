import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useSignup from "../hooks/useSignup";

const SignUp = () => {
    const { signup } = useSignup();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const location = useLocation();
    const role = location.state?.role;

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setError('');
            await signup(email, user, password, role);
            if (role === "customer") {
                navigate("/CustomerProductPage");
            } else if (role === "admin") {
                navigate("/AdminProductPage");
            }
        } 
        
        catch (err) {
            setError(err.message);
            console.error('Signup error:', err);
        }
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <label>Email: </label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} value={email}/>
            <label>User: </label>
            <input type="text" onChange={(e) => setUser(e.target.value)} value={user}/>
            <label>Password: </label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <button>Submit</button>
            {error && <div className="form-error-msg">{error}</div>}
        </form>
    )
}

export default SignUp;