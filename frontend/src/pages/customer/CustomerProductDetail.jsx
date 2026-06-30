import {useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { authenticateContext } from "../../context/authenticateContext.jsx";
import { ProductContext } from "../../context/productContext.jsx";
import noImage from "../../assets/noImage.png";

const CustomerProductDetail = () => {
    const { user } = useContext(authenticateContext);
    const {id} = useParams();
    const {state: {products}} = useContext(ProductContext);
    const [product, setProduct] = useState(null);
    
    useEffect(() => {
        setProduct(null);

        const product = products?.find((product) => String(product._id) === String(id));
        
        if (product) {
            setProduct(product);
            return;
        }
        if (!user) {
            return;
        }

        // if someone refreshes the page, can still access using params
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/store/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Fetch failed!");
                }

                const productData = await response.json();
                setProduct(productData);
            } 
            catch (err) {
                console.log(err);
                setProduct(null);
            }
        };

        if (user) {
            fetchProduct();
        };
    }, [id, user, products]);

    if (!product) {
        return <div className="product-detail-page product-detail-empty">Product not found</div>;
    }
    return (
        <main className="product-detail-page">
            <section className="product-detail-card">
                <div className="product-detail-image-panel">
                    <img
                        src={product.image ? product.image : noImage}
                        alt={`image of ${product.title}`}
                        className="product-detail-image"
                    />
                </div>

                <div className="product-detail-info">
                    <p className="product-detail-eyebrow">Product Details</p>
                    <h1>{product.title}</h1>
                    <p className="product-detail-price">${product.price}</p>
                    <p className="product-detail-description">{product.description}</p>

                    <div className="product-detail-status-row">
                        {product.quantity > 0 ? (
                            <span className="product-detail-status product-detail-status-available">
                                Product Available
                            </span>
                        ) : (
                            <span className="product-detail-status product-detail-status-unavailable">
                                Product Unavailable
                            </span>
                        )}
                        <span className="product-detail-quantity">Quantity: {product.quantity}</span>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default CustomerProductDetail;
