import { authenticateContext } from "../context/authenticateContext";

import { useContext } from "react";

    const useSignup = () => {
        
        const { dispatch } = useContext(authenticateContext);

        const signup = async (email, username, password) => {
            try {
                const response = await fetch('http://localhost:4000/api/user/signup', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, username, password})
                })  
                    
                const user = await response.json();

                if (response.ok) {
                    // save the user to local storage
                    localStorage.setItem('user', JSON.stringify(user));
                    // update the auth context
                    dispatch({type: "LOGIN", payload: user});
                } else {
                    throw new Error(user.error || 'Signup failed');
                }
            } catch (error) {
                console.error('Signup error:', error);
                throw error;
            }
        }

        return {  signup };
    }

export default useSignup;