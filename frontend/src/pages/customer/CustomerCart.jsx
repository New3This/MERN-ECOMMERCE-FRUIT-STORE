import CartCard from "../../components/CartCard.jsx";
import { useEffect, useState, useContext } from "react";
import { authenticateContext } from "../../context/authenticateContext";
import { useNavigate } from "react-router-dom";
import currencyFormatter from "../../utility/currencyFormatter.jsx";
import { ProductContext } from "../../context/productContext.jsx";

const CustomerCart = () => {
    const [product, setProduct] = useState([]);
    const {user, dispatch} = useContext(authenticateContext);
    const { dispatch: productDispatch } = useContext(ProductContext);
    const navigate = useNavigate();

    const total = product.reduce((accumalator, currentValue) => {
        return accumalator + currentValue.cartQuantity * currentValue.price;
    }, 0)

    const handlePayment = async () => {
        const response = await fetch("http://localhost:4000/api/store/checkout", {
            method: "POST",
            headers: {
                'Content-type' : 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Checkout failed");
        }

        window.location.href = data.url;
    }

    const handleDelete = async (productItem) => {
        try {
            const response = await fetch(`http://localhost:4000/api/store/addToCart/${productItem._id}`, {
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

                const updatedProducts = update.cart.map((savedItem) => (
                    {...savedItem.product, cartQuantity: savedItem.quantity}
                ));

                setProduct(updatedProducts);
                productDispatch({
                    type: "ADJUST_PRODUCT_STOCK",
                    payload: {
                        _id: productItem._id,
                        quantity: productItem.quantity + productItem.cartQuantity
                    }
                });

                const userPlusToken = {...update, token: user.token};
                localStorage.setItem('user', JSON.stringify(userPlusToken));
                dispatch({ type: 'LOGIN', payload: userPlusToken });

                // console.log(userPlusToken);
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    const handleIncrement = async (productItem) => {
        if (productItem.quantity <= 0) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/api/store/addToCart/increment/${productItem._id}`, {
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
                const updatedProducts = update.map((cartItem) => ({...cartItem.product, cartQuantity: cartItem.quantity}));
                setProduct(updatedProducts);
                productDispatch({
                    type: "ADJUST_PRODUCT_STOCK",
                    payload: {
                        _id: productItem._id,
                        quantity: Math.max(productItem.quantity - 1, 0)
                    }
                });
            }

        }
        catch (err) {
            console.log(err);
        }
    }


    const handleDecrement = async (product) => {
        
        if (product.cartQuantity <= 1) {
            await handleDelete(product);
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/api/store/addToCart/decrement/${product._id}`, {
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
                const updatedProducts = update.map((cartItem) => ({...cartItem.product, cartQuantity: cartItem.quantity}));
                setProduct(updatedProducts);
                productDispatch({
                    type: "ADJUST_PRODUCT_STOCK",
                    payload: {
                        _id: product._id,
                        quantity: product.quantity + 1
                    }
                });
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
        <div className="checkout-container">
            {product && product.map((product) => (
                <CartCard key={product._id} product={product} handleDelete={handleDelete} handleIncrement={handleIncrement} handleDecrement={handleDecrement}/>
            ))}
            <h1>Total Price: {currencyFormatter(total)} </h1>
            <button onClick={handlePayment} className="checkout-purchase">Checkout</button>
        </div>
    )
}

export default CustomerCart;
