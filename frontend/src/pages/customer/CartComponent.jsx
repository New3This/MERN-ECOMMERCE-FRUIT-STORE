import { useEffect } from "react";
import trash from "../../assets/trash.png";
import noImage from "../../assets/noImage.png"
import currencyFormatter from "../../utility/currencyFormatter";

const CartComponent = ({ setOpenCart, user, dispatch, openCart, setProductCart, productCart }) => {
    // const total = product.reduce((accumalator, currentValue) => {
    //     return accumalator + currentValue.cartQuantity * currentValue.price;
    // }, 0)

    const navigateCheckout = async () => {
        const response = await fetch("http://localhost:4000/api/store/checkout", {
            method: "POST",
            headers: {
                'Content-type' : 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const {url} = await response.json();
        window.location.href = url;
    };

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

                const updatedProducts = update.cart.map((savedItem) => (
                    {...savedItem.product, cartQuantity: savedItem.quantity}
                ));

                setProductCart(updatedProducts);

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
                setProductCart(product);
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
            await handleDelete(product._id);
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
                const product = update.map((cartItem) => ({...cartItem.product, cartQuantity: cartItem.quantity}));
                setProductCart(product);
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
                    <img src={trash} alt="Trash" className="trash-mini" onClick={() => handleDelete(product._id)} />
                    <p className="product-mini-title">{product.title}</p>
                    <p className="product-mini-price">{currencyFormatter(product.price)}</p>
                    <img src={product.image ? product.image : noImage} alt={product.title} className="product-mini-image"/>
                    <div className="cart-quantity-mini">
                        <button onClick={() => handleIncrement(product._id)} className="increment-mini">+</button>
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

