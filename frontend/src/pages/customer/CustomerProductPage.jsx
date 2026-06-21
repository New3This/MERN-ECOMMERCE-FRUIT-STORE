import {useEffect, useContext} from "react";
import { authenticateContext } from "../../context/authenticateContext.jsx";
import { ProductContext } from "../../context/productContext.jsx";
import CatalogueCard from "../../components/CatalogueCard.jsx";

const CustomerProductPage = () => {
    const {state: {products}, dispatch} = useContext(ProductContext);
    const {user} = useContext(authenticateContext);

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
    }, [user]);

   const handleDelete = async (product) => {
        if (!user) {
            return
        }
        try {
            const response = await fetch(`http://localhost:4000/api/store/${product._id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Fetch failed!");
            }

            else {
                const json = await response.json();
                dispatch({type: "DELETE_PRODUCT", payload: json});
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h1>Customer Product Page</h1>

            {products && products.map((product) => (
                <CatalogueCard key={product._id} product={product} handleDelete={handleDelete}/>
            ))}

        </div>
    )
}

export default CustomerProductPage;