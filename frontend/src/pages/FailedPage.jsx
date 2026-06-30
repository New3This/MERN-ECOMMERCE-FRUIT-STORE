import { Link } from "react-router-dom";
import cross from "../assets/cross.png"

const FailedPage = () => {
    return (
        <div className="transaction-container">
            <img src={cross} alt="fail" className="transaction-img" />
            <div className="success-title">Your transaction has failed to be completed.</div>
            <div className="result-actions">
                <Link to="/cart" className="result-button result-button-primary">Return to cart</Link>
                <Link to="/product" className="result-button result-button-secondary">Browse products</Link>
            </div>
        </div>
    )
}

export default FailedPage;
