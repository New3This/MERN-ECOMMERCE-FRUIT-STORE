import { createContext, useReducer } from 'react'

export const authenticateContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {user: action.payload}
        case "SIGNUP":
            return {user: action.payload}
        case "LOGOUT":
            return {user: null}
        default:
            return state;
    }
}

export const AuthenticateProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    console.log("Current state is ", state);

    return (
        <authenticateContext.Provider value={{...state, dispatch}}>
            {children}
        </authenticateContext.Provider>
    )
}