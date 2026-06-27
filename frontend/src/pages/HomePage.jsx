import {useNavigate} from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const handleCustomer = () => {
        navigate("/CustomerHomePage", { state: {role: "customer"} });
    };

    const handleAdmin = () => {
        navigate("/AdminHomePage", { state: {role: "admin"} });
    };

    return (
        <div className="visit-mode">
            <div id="visit-question">Which are you?</div>
            <div className="visit-buttons">
                <button onClick={handleCustomer} id="visit-customer">Customer</button>
                <button onClick={handleAdmin} id="visit-admin">Admin</button>
            </div>

        </div>
    )
}

export default HomePage;
