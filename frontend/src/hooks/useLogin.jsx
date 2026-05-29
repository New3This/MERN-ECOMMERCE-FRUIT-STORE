import { authenticateContext } from "../context/authenticateContext";

import { useContext } from "react";

    const useLogin = () => {
        
        const { dispatch } = useContext(authenticateContext);

        const login = async (email, username, password) => {
            try {
                const response = await fetch('http://localhost:4000/api/user/login', {
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
                    throw new Error(user.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        }

        return { login };
    }

export default useLogin;