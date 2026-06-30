import trash from "../assets/trash.png";
import currencyFormatter from "../utility/currencyFormatter";
import noImage from "../assets/noImage.png"
const CartCard = ({product, handleDelete, handleIncrement, handleDecrement}) => {


    return (
            <div className="customer-checkout-cart">
                <div className="customer-checkout-img">
                    <img src={product.image ? product.image : noImage} alt={product.title} className="customer-image"/>
                </div>
                <div className="customer-checkout-info">
                    <div className="product-title-cart">{product.title}</div>
                    <div className="product-description-cart">{product.description}</div>
                    <div className="">{currencyFormatter(product.price)}</div>
                    <div className="increment-btn-container">
                        <button onClick={() => handleIncrement(product)} className="increment-btn" disabled={product.quantity <= 0}>+</button>
                        <span className="product-btn-quantity">{product.cartQuantity}</span>
                        <button onClick={() => handleDecrement(product)} className="decrement-btn">-</button>
                    </div>
                    <button src={trash} alt="Trash" className="remove-btn" onClick={() => handleDelete(product)} >Remove</button>
                </div>
            </div>
    )
}

export default CartCard;
