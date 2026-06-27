import { useNavigate } from "react-router-dom";

const CustomerAbout = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <div className="about-hero">
                <div className="about-hero-copy">
                    <h1>Thoughtful products, presented with a little more personality.</h1>
                    <p className="about-lead">
                        Storelio is designed to make a small store feel polished from the
                        first visit. Instead of an empty layout, shoppers see a curated
                        storefront with product details, cart support, and a checkout flow
                        that feels ready to use.
                    </p>
                </div>
                <div className="about-grid">
                    <div className="about-card">
                        <h3>Curated Products</h3>
                        <p>A focused catalog that feels intentional instead of empty or overwhelming</p>
                    </div>
                    <div className="about-card">
                        <h3>Simple Checkout</h3>
                        <p>Fast cart updates and a clean Stripe flow so the shopping experience stays smooth</p>
                    </div>
                    <div className="about-card">
                        <h3>Built for Growth</h3>
                        <p>Easy to expand with more products, images, promotions, and store features later</p>
                    </div>
                </div>
            </div>

            <div className="about-section">
                <div className="about-cta">
                    <div>
                        <p className="about-eyebrow">Ready to shop?</p>
                        <h2>Jump into the catalog and see the store in action.</h2>
                    </div>
                    <button className="about-primary-btn" onClick={() => navigate("/product")}>
                        Explore Products
                    </button>
                </div>
            </div>



        </div>
    );
};

export default CustomerAbout;
