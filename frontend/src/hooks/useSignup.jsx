import { authenticateContext } from "../context/authenticateContext";

import { useContext } from "react";

    const useSignup = () => {
        
        const { dispatch } = useContext(authenticateContext);

        const signup = async (email, username, password, role) => {
            try {
                const response = await fetch('http://localhost:4000/api/user/signup', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, username, password, role})
                })  
                    
                const userPlusToken = await response.json();

                if (response.ok) {
                    // save the user to local storage
                    localStorage.setItem('user', JSON.stringify(userPlusToken));
                    // update the auth context
                    dispatch({type: "LOGIN", payload: userPlusToken});
                } 
                else {
                    throw new Error(userPlusToken.error);
                }
            } 
            catch (error) {
                throw new Error(error);
            }
        }

        return { signup };
    }

export default useSignup;