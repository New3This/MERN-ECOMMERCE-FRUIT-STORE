import { Link } from "react-router-dom";
import success from "../assets/check.png"

const SuccessPage = () => {
    return (
        <div className="transaction-container">
            <img src={success} alt="success" className="transaction-img"/>
            <div className="success-title">Your transaction has been completed successfully.</div>
            <div className="result-actions">
                <Link to="/product" className="result-button result-button-primary">Continue shopping</Link>
                <Link to="/" className="result-button result-button-secondary">Go home</Link>
            </div>
        </div>
    )
}

export default SuccessPage;
