import { useState } from "react";
import useLogin from "../hooks/useLogin";

const Login = () => {
    const [EmailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(EmailUser, EmailUser, password);
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <label>Email/Username: </label>
            <input type="text" onChange={(e) => setEmailUser(e.target.value)} value={EmailUser}/>

            <label>Password: </label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <button>Submit</button>
        </form>
    )
}

export default Login;