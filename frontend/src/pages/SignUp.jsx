import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useSignup from "../hooks/useSignup";
import signupImage from "../assets/signup.jpg";
import adminImage from "../assets/admin-sign-up.png";
import adminRightImage from "../assets/admin-signup-right.png";

import appleImage from "../assets/apple.png";


const SignUp = () => {
    const { signup } = useSignup();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const location = useLocation();
    const role = location.state?.role;

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {

            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

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
            <>
                <button className="back-arrow" onClick={() => navigate(-1)}>
                &larr;
                </button>
                <div className="sign-up">

                <div className={role == "customer" ? "signup-left-background" : "signup-admin-background"}>
                    {role == "customer" ? 
                        (
                            <>
                                <h1 className="welcome-title">Come join us</h1>
                                <div className="welcome-desc">Become part of our store community. Sign up to discover products tailored to your style and enjoy a seamless shopping experience.</div>
                                <img src={signupImage} alt="sign-up image"/>
                            </>
                        ) : 
                        ( 
                            <>
                                <h1 className="welcome-title">Become an Admin!!!</h1>
                                <div className="welcome-desc">Join the team behind the store. Sign in as an administrator to manage products for every visitor.</div>
                                <img src={adminImage} alt="sign-up image" className="admin-signup-image"/>
                            </>
                        )
                    }
                </div>
                <form className={role === "customer" ? "sign-up-form" : "sign-up-form-2"} onSubmit={handleSubmit}>
                    <div className="sign-up-title">Sign Up</div>
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <input type="text" placeholder="Username" onChange={(e) => setUser(e.target.value)} value={user}/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>
                    <button id="sign-up-button">Sign Up</button>
                    {error && <div className="form-error-msg">{error}</div>}
                    {role == "customer" ? <img src={appleImage} alt="image of apple"/> : <img src={adminRightImage} alt="image of apple" className="admin-right"/> }
                </form>
            </div>
        </>
    )
}

export default SignUp;