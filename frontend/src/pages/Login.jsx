import { useState } from "react";

const Login = () => {
    const [EmailUser, setEmailUser] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(EmailUser, password);
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