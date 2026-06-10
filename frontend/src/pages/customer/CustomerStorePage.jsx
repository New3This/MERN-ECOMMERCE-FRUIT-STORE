import { useEffect, useState, useContext } from "react";
import ProductGroup from "../../components/ProductGroup.jsx";
import ProductForm from "../../components/ProductForm.jsx"
import { ProductContext } from "../../context/productContext.jsx";
import { authenticateContext } from "../../context/authenticateContext.jsx";

const CustomerStorePage = () => {
    const { state: {products}, dispatch } = useContext(ProductContext);
    const { user } = useContext(authenticateContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/store/', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Fetch failed!");
                }

                else {
                    const product = await response.json();
                    dispatch({type: "SET_PRODUCTS", payload: product});
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        if (user) {
            fetchProducts();
        }
    }, [user])

    

    return (
        <div className="admin-page">

            <div className="product-group-container">

                {products && products.map((product) => (
                    <ProductGroup key={product._id} product={product} />
                ))}

            </div>

            <div className="product-form-container">
                <ProductForm/>
            </div>

        </div>

    )
}

export default CustomerStorePage;