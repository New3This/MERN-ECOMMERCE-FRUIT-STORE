import deleteIcon from "../assets/close.png";
import { authenticateContext } from "../context/authenticateContext";
import { useContext } from "react";

const UserGroup = ({user, delUser}) => {

    // const {user: adminUser} = useContext(authenticateContext);

    return (
        <div>
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <img src={deleteIcon} onClick={() => delUser(user._id)} alt="delete-button"style={{width:"100px", height:"100px"}}/>
        </div>
    );

}

export default UserGroup;