import { createContext, useEffect, useReducer } from 'react'

export const authenticateContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "SIGNUP":
            return {user: action.payload, authReady: true}
        case "LOGIN":
            return {user: action.payload, authReady: true}
        case "LOGOUT":
            return {user: null, authReady: true}
        default:
            return state;
    }
}

export const AuthenticateProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authReady: false
    });
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
        else {
            dispatch({type: 'LOGOUT'});
        }
    }, []);

    console.log("Current state is ", state);

    return (
        <authenticateContext.Provider value={{...state, dispatch}}>
            {children}
        </authenticateContext.Provider>
    )
}