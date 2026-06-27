import { useNavigate } from "react-router-dom";

const CustomerLandingPage = () => {

    const navigate = useNavigate();

    return (
        <div className="customer-landing-page">
            <div className="customer-landing-hero">
                <div className="customer-landing-copy">
                    <h1>Storelio is ready whenever you are.</h1>
                    <p className="customer-landing-lead">
                        Feel free to view our selection of products, see what we're about, or view your cart for checkout
                    </p>

                    <div className="customer-landing-actions">
                        <button onClick={() => navigate("/product")} className="customer-landing-primary-btn">
                            Browse Products
                        </button>
                        <button onClick={() => navigate("/cart")} className="customer-landing-secondary-btn">
                            View Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="customer-landing-grid">
                <button className="customer-landing-card" onClick={() => navigate("/product")}>
                    <img src="/home-cart.png" alt="Browse Products" className="customer-landing-card-image" />
                    <div className="customer-landing-card-body"> <h2>Browse Products</h2> <p>Jump straight into the catalog and start shopping</p> </div>
                </button>
                <button className="customer-landing-card" onClick={() => navigate("/about")}>
                    <img src="/home-gifts.png" alt="View About" className="customer-landing-card-image" />
                    <div className="customer-landing-card-body"> <h2>View About</h2> <p>See what Storelio is about and how the storefront works</p> </div>
                </button>
                <button className="customer-landing-card" onClick={() => navigate("/cart")}>
                    <img src="/home-person.png" alt="Open Cart" className="customer-landing-card-image" />
                    <div className="customer-landing-card-body"> <h2>Open Cart</h2> <p>Review your items and head to checkout when you're ready</p> </div>
                </button>
            </div>
        </div>
    );
};

export default CustomerLandingPage;
