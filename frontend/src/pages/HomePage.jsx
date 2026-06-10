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
        <>
            <span>Which are you?</span>
            <button onClick={handleCustomer}>Customer</button>
            <button onClick={handleAdmin}>Admin</button>
        </>
    )
}

export default HomePage;