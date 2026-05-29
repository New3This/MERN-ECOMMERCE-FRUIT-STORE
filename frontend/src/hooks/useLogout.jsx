import { authenticateContext } from "../context/authenticateContext";
import {useContext} from "react";

const useLogout = () => {
    const { dispatch } = useContext(authenticateContext);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('user');
    }

    return { logout };

}

export default useLogout;   