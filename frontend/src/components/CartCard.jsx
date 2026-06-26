import trash from "../assets/trash.png";
import currencyFormatter from "../utility/currencyFormatter";
import noImage from "../assets/noImage.png"
const CartCard = ({product, handleDelete, handleIncrement, handleDecrement}) => {


    return (
        <div>
            <div className="product-description">
                <p className="product-title">{product.title}</p>
                <p className="product-price">{currencyFormatter(product.price)}</p>
                <img src={product.image ? product.image : noImage} alt={product.title} className="product-image" style={{ maxWidth: '100%', height: 'auto' }} />
                <button onClick={() => handleIncrement(product._id)}>+</button>
                <span className="product-quantity"><strong>Quantity:</strong> {product.cartQuantity}</span>
                <button onClick={() => handleDecrement(product)}>-</button>
            </div>
            <div className="delete-product">
                <img src={trash} alt="Trash" onClick={() => handleDelete(product._id)} />
            </div>
        </div>
    )
}

export default CartCard;