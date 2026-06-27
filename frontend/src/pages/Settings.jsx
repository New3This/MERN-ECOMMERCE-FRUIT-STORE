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
        <main className="settings-page">
            <section className="settings-card">
                <h1 className="settings-title">Edit Profile</h1>

                <form onSubmit={handleUpdate} className="settings-form">
                    <label>Username</label>
                    <input value={username} onChange={(e) => setUserName(e.currentTarget.value)}/>

                    <label>Password</label>
                    <div className="settings-password-row">
                        <input type={visible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
                        <img src={visible ? closeEye : eye} alt="see password button" onClick={() => setVisible(!visible)} className="settings-eye" />
                    </div>

                    <label>Confirm Password</label>
                    <div className="settings-password-row">
                        <input type={visibleToo ? "text" : "password"} value={passwordToo} onChange={(e) => setPasswordToo(e.currentTarget.value)}/>
                        <img src={visibleToo ? closeEye : eye} alt="see password button" onClick={() => setVisibleToo(!visibleToo)} className="settings-eye" />
                    </div>

                    {errorField.length > 0 && <div className="settings-error">{errorField.join(" and ")}</div>}
                    <button type="submit" className="settings-save-btn">Save Changes</button>
                </form>

                <button onClick={handleAcc} className="settings-danger-btn">Delete Account</button>
            </section>
        </main>
    )
}

export default Settings;
