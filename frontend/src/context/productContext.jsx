import {createContext, useReducer } from "react";


export const ProductContext = createContext();

const reducer = (state, action) => {
    if (action.type === "SET_PRODUCTS") {
        return {
            products: action.payload
        };
    }

    else if (action.type === "UPDATE_PRODUCT") {
        return {
            products: [action.payload, ...state.products]
        }
    }

    return state;

}


export const ProductsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, {products: null});

    return (
        <ProductContext.Provider value={{ state, dispatch }}>
            {children}
        </ProductContext.Provider>
    )    
}
