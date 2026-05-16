import { useEffect, useState } from "react";
import ProductGroup from "./ProductGroup.jsx";
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
        <div className="Home">
            <h2>Admin Page</h2>
            {products && products.map((product) => (
                <ProductGroup key={product._id} product={product} />
            ))}
        </div>
    )
}

export default Admin;