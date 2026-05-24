import { useState } from "react";
import useSignup from "../hooks/useSignup";

const SignUp = () => {
    const { signup } = useSignup();
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setError('');
            await signup(email, user, password);
        } 
        
        catch (err) {
            setError(err.message);
            console.error('Signup error:', err);
        }
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <label>Email: </label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} value={email}/>
            <label>User: </label>
            <input type="text" onChange={(e) => setUser(e.target.value)} value={user}/>
            <label>Password: </label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <button>Submit</button>
        </form>
    )
}

export default SignUp;