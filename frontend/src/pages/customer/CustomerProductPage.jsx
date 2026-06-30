import {useEffect, useContext, useState} from "react";
import { authenticateContext } from "../../context/authenticateContext.jsx";
import { ProductContext } from "../../context/productContext.jsx";
import CatalogueCard from "../../components/CatalogueCard.jsx";
import CartComponent from "./CartComponent.jsx";


const CustomerProductPage = () => {

    const [openCart, setOpenCart] = useState(false);
    const {state: {products}, dispatch: productDispatch} = useContext(ProductContext);
    const {user, dispatch: userDispatch} = useContext(authenticateContext);
    const [productCart, setProductCart] = useState([]);
    
    useEffect(() => {
        const fetchCart = async () => {
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
                const product = productData.map((savedItem) => ({
                    ...savedItem.product, cartQuantity: savedItem.quantity
                }));

                setProductCart(product);
                console.log(product);
            } 
            catch (err) {
                console.log(err);
            }
        };

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
                    productDispatch({type: "SET_PRODUCTS", payload: product});
                    // console.log("HO");
                }
            }
            catch (err) {
                console.log(err);
            }
        };

        if (user) {
            fetchProducts();
            fetchCart();
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
                productDispatch({type: "DELETE_PRODUCT", payload: json});
                setProductCart((currentCart) => currentCart.filter((item) => item._id !== product._id));
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="customer-product-page-container">
            <h1>Customer Product Page</h1>
            <div className="customer-product-page">

                {products && products.map((product) => (
                    <CatalogueCard key={product._id} product={product} handleDelete={handleDelete} userDispatch={userDispatch} setOpenCart={setOpenCart}/>
                ))}
            </div>
            <CartComponent setOpenCart={setOpenCart} dispatch={userDispatch} user={user} openCart={openCart} setProductCart={setProductCart} productCart={productCart}/>

        </div>
    )
}

export default CustomerProductPage;
