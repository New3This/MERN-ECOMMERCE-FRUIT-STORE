import CartCard from "../../components/CartCard.jsx";
import { useEffect, useState, useContext } from "react";
import { authenticateContext } from "../../context/authenticateContext";

const CustomerCart = () => {
    const [product, setProduct] = useState([]);
    const {user} = useContext(authenticateContext);
    
    const handleDelete = async (productID) => {
        try {
            const response = await fetch(`http://localhost:4000/api/store/addToCart/${productID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
            })

            if (!response.ok) {
                throw new Error("Failed to remove cart item");
            }
            else {
                const update = await response.json();
                const updatedProducts = update.map((savedItem) => savedItem.product);
                setProduct(updatedProducts);
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    const handleIncrement = async (productID) => {
        try {
            const response = await fetch(`http://localhost:4000/api/store/addToCart/increment/${productID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
            })

            if (!response.ok) {
                throw new Error("Failed to increment cart item");
            }
            else {
                const update = await response.json();
                const product = update.map((cartItem) => ({...cartItem.product, cartQuantity: cartItem.quantity}));
                setProduct(product);
            }

        }
        catch (err) {
            console.log(err);
        }
    }


    const handleDecrement = async (productID) => {
    try {
        const response = await fetch(`http://localhost:4000/api/store/addToCart/decrement/${productID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        }
        })

        if (!response.ok) {
            throw new Error("Failed to increment cart item");
        }
        else {
            const update = await response.json();            
            const product = update.map((cartItem) => ({...cartItem.product, cartQuantity: cartItem.quantity}));
            setProduct(product);
        }

    }
    catch (err) {
        console.log(err);
    }
}

    useEffect(() => {

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
                const product = productData.map((savedItem) => ({
                    ...savedItem.product, cartQuantity: savedItem.quantity
                }));

                setProduct(product);
                console.log(product);
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
            {product && product.map((product) => (
                <CartCard key={product._id} product={product} handleDelete={handleDelete} handleIncrement={handleIncrement} handleDecrement={handleDecrement}/>
            ))}
        </>
    )
}

export default CustomerCart;