import {useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { authenticateContext } from "../../context/authenticateContext.jsx";
import { ProductContext } from "../../context/productContext.jsx";

const CustomerProductDetail = () => {
    const { user } = useContext(authenticateContext);
    const {id} = useParams();
    const {state: {products}} = useContext(ProductContext);
    const [product, setProduct] = useState(null);
    useEffect(() => {

        const product = products.find((product) => product._id === id);
        
        if (product) {
            setProduct(product);
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
    }, [user]);

    if (!product) {
        return <div>Product not found</div>;
    }
    return (
        <div>
            <h1>{product.title}</h1>
            <img src={product.image} alt={`image of ${product.title}`}/>
            <p>Price: {product.price}</p>
            <p>Description: Need to add description property to model</p>
            {product.quantity > 0 ? <p>Product Available</p> : <p>Product Unavailable</p>}
        </div>
    )

}

export default CustomerProductDetail;