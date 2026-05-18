import { useEffect, useState } from "react";
import ProductGroup from "../components/ProductGroup.jsx";
import ProductForm from "../components/ProductForm.jsx"

const Admin = () => {
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/store/');

                if (!response.ok) {
                    throw new Error("Fetch failed!");
                }

                else {
                    const product = await response.json();
                    setProducts(product);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        fetchProducts();

    }, [])

    

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

export default Admin;