import {useEffect, useState, useContext} from "react";
import UserGroup from "../../components/UserGroup.jsx";
import { authenticateContext } from "../../context/authenticateContext.jsx";

const UserInformation = () => {
    const [userInfo, setUserInfo] = useState(null);
    const { user } = useContext(authenticateContext);
    
    useEffect(() => {
        if (!user) return;

        const fetchUserInformation = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/store/users', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
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
    }, [user]);

    return (
        <div>

            {userInfo && userInfo.map((user) => (
                <UserGroup key={user._id} user={user} />
            ))}
        </div>
    );

}

export default UserInformation;