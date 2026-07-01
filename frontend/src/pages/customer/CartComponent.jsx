import { useContext, useEffect } from "react";
import trash from "../../assets/trash.png";
import noImage from "../../assets/noImage.png"
import currencyFormatter from "../../utility/currencyFormatter";
import { ProductContext } from "../../context/productContext.jsx";

const CartComponent = ({ setOpenCart, user, dispatch, openCart, setProductCart, productCart }) => {
    const { dispatch: productDispatch } = useContext(ProductContext);
    // const total = product.reduce((accumalator, currentValue) => {
    //     return accumalator + currentValue.cartQuantity * currentValue.price;
    // }, 0)

    const navigateCheckout = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/checkout`, {
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
    };

    const handleDelete = async (product) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/addToCart/${product._id}`, {
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

                setProductCart(updatedProducts);
                productDispatch({
                    type: "ADJUST_PRODUCT_STOCK",
                    payload: {
                        _id: product._id,
                        quantity: product.quantity + product.cartQuantity
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

    const handleIncrement = async (product) => {
        if (product.quantity <= 0) {
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/addToCart/increment/${product._id}`, {
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
                const updatedCartProducts = update.map((cartItem) => ({...cartItem.product, cartQuantity: cartItem.quantity}));
                setProductCart(updatedCartProducts);
                productDispatch({
                    type: "ADJUST_PRODUCT_STOCK",
                    payload: {
                        _id: product._id,
                        quantity: Math.max(product.quantity - 1, 0)
                    }
                });
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    const total = productCart.reduce((accumalator, currentValue) => {
        return accumalator + currentValue.cartQuantity * currentValue.price;
    }, 0);

    const formattedTotal = currencyFormatter(total);

    const handleDecrement = async (product) => {
        
        if (product.cartQuantity <= 1) {
            await handleDelete(product);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/addToCart/decrement/${product._id}`, {
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
                const updatedCartProducts = update.map((cartItem) => ({...cartItem.product, cartQuantity: cartItem.quantity}));
                setProductCart(updatedCartProducts);
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

    return (
        <div className={openCart ? "cart-open" : "cart-close"}>
            <div className="close-button-container">
                <h1>Shopping Cart:</h1>
                <button onClick={() => setOpenCart(!openCart)} className="close-button">X</button>
            </div>
            {productCart && productCart.map((product) => (
                <div className="product-mini-description" key={product._id}>
                    <img src={trash} alt="Trash" className="trash-mini" onClick={() => handleDelete(product)} />
                    <p className="product-mini-title">{product.title}</p>
                    <p className="product-mini-price">{currencyFormatter(product.price)}</p>
                    <img src={product.image ? product.image : noImage} alt={product.title} className="product-mini-image"/>
                    <div className="cart-quantity-mini">
                        <button onClick={() => handleIncrement(product)} className="increment-mini" disabled={product.quantity <= 0}>+</button>
                        <span className="product-mini-quantity">{product.cartQuantity}</span>
                        <button onClick={() => handleDecrement(product)} className="decrement-mini">-</button>
                    </div>

                </div>
            ))}
            <h1><hr></hr>Total Price: {formattedTotal} </h1>
            <button onClick={navigateCheckout}>Checkout</button>
        </div>
    );
}

export default CartComponent;

