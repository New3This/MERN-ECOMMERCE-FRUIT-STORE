import {useEffect, useState, useContext} from "react";
import UserGroup from "../../components/UserGroup.jsx";
import { authenticateContext } from "../../context/authenticateContext.jsx";

const UserInformation = () => {
    const [userInfo, setUserInfo] = useState(null);
    const { user: adminUser } = useContext(authenticateContext);

    const handleDelUser = async (userID) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/deleteUser/${userID}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${adminUser.token}`
        }
    });

    if (!response.ok) {
        console.log("Failed to Delete");
    }
    else {
        const msg = await response.json();
        setUserInfo(prev => prev.filter((current) => current._id !== userID));
        console.log(msg);
    }
    console.log("DELETE");
}

    useEffect(() => {
        const fetchUserInformation = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/customers`, {
                    headers: {
                        'Authorization': `Bearer ${adminUser.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Fetch failed!");
                }
                
                const userData = await response.json();
                setUserInfo(userData);
            } 
            catch (error) {
                console.error(error);
            }
        };
        fetchUserInformation();
    }, [adminUser]);

    return (
        <div>
            <h1>Customers:</h1>
            {userInfo && userInfo.map((user) => (
                <UserGroup key={user._id} user={user} delUser={handleDelUser} />
            ))}
        </div>
    );

}

export default UserInformation;