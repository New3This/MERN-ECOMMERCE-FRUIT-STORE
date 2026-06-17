import ProductGroup from "../../components/ProductGroup";
import { useEffect, useState, useContext } from "react";
import { authenticateContext } from "../../context/authenticateContext";

const CustomerCart = () => {
    const [product, setProduct] = useState([]);
    const {user} = useContext(authenticateContext);

    useEffect(() => {

        // if someone refreshes the page, can still access using params
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/store/addToCart`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Fetch failed!");
                }

                const productData = await response.json();
                const product = productData.map((savedItem) => savedItem.product)
                setProduct(product);
            } 
            catch (err) {
                console.log(err);
            }
        };

        if (user) {
            fetchProduct();
        }
    }, [user]);
    return (
        <>
        hi
            {product && product.map((product) => (
                <ProductGroup key={product._id} product={product} />
            ))}
        </>
    )
}

export default CustomerCart;