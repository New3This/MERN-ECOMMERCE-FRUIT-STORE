import {createContext, useReducer } from "react";


export const ProductContext = createContext();

const reducer = (state, action) => {
    if (action.type === "SET_PRODUCTS") {
        return {
            products: action.payload
        };
    }

    else if (action.type === "ADD_PRODUCT") {
        return {
            products: [action.payload, ...state.products]
        }
    }

    else if (action.type === "DELETE_PRODUCT") {
        return {
            products: state.products.filter((product) => product._id !== action.payload._id)
        }
    }

    return state;

}


export const ProductsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, {
        products: []
    });

    return (
        <ProductContext.Provider value={{ state, dispatch }}>
            {children}
        </ProductContext.Provider>
    )    
}
