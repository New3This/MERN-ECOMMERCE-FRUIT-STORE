import { authenticateContext } from "../context/authenticateContext";
import {useContext} from "react";
import { ProductContext } from "../context/productContext";

const useLogout = () => {
    const { dispatch } = useContext(authenticateContext);
    const { dispatch: productDispatch } = useContext(ProductContext);
    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        productDispatch({ type: 'SET_PRODUCTS', payload: null });
        localStorage.removeItem('user');
    }

    return { logout };

}

export default useLogout;   