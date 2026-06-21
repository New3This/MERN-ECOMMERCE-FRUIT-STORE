import {useState, useContext} from "react";
import { authenticateContext } from "../context/authenticateContext";
import eye from "../../src/assets/eye.png";
import closeEye from "../../src/assets/hide.png";

const Settings = () => {
    const {user, dispatch} = useContext(authenticateContext);

    const [username, setUserName] = useState(user.username);
    const [password, setPassword] = useState("");
    const [passwordToo, setPasswordToo] = useState("");
    const [visible, setVisible] = useState(false);
    const [visibleToo, setVisibleToo] = useState(false);
    const [errorField, setErrorField] = useState([]);


    const handleAcc = async() => {
        const response = await fetch(`http://localhost:4000/api/store/deactivate`, {
            method: "DELETE",
            headers: {
                'Authorization' : `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        if (!response.ok) {
            console.log(json);
        }

        else {
            localStorage.removeItem("user");
            dispatch({type:"LOGOUT"});
        }
    }


    const handleUpdate = async (e) => {

        const userData = {username, password};

        e.preventDefault();
        if (password !== passwordToo) {
            return console.log("Passwords do not match");
        }

        try {
            const response = await fetch(`http://localhost:4000/api/store/profile`, {
                method: "PATCH",
                body: JSON.stringify(userData),
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization' : `Bearer ${user.token}`
                }
            });

            const json = await response.json();


            if (!response.ok) {
                setErrorField(json.errorField);
            }

            else {
                const updatedUser = {...user, username: json.username, password: json.password};
                setUserName(updatedUser.username);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                dispatch({type:"LOGIN", payload:updatedUser});
                setErrorField([]);
                setPassword("");
                setPasswordToo("");
            }
        }

        catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div>Edit Profile</div>
            <form onSubmit={handleUpdate}>
                <label>Username: </label>
                <input value={username} onChange={(e) => setUserName(e.currentTarget.value)}/>
                <label>Password: </label>
                <input type={visible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
                <label>Confirm Password: </label>
                <input type={visibleToo ? "text" : "password"} value={passwordToo} onChange={(e) => setPasswordToo(e.currentTarget.value)}/>
                <img src={visible ? closeEye : eye} alt="see password button" onClick={() => setVisible(!visible)} ></img>
                <img src={visibleToo ? closeEye : eye} alt="see password button" onClick={() => setVisibleToo(!visibleToo)} ></img>
                <button type="submit">Submit</button>
                {errorField.length > 0 && <div>{errorField.join(" and ")}</div>}
            </form>
            <button onClick={handleAcc}>Delete Account</button>
        </>
    )
}

export default Settings;