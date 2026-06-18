import trash from "../assets/trash.svg";


const CartCard = ({product, handleDelete}) => {


    return (
        <div>
            <div className="product-description">
                <p className="product-title">{product.title}</p>
                <p className="product-price"><strong>Price:</strong> {product.price}</p>
                <p className="product-quantity"><strong>Quantity:</strong> {product.cartQuantity}</p>
                <img src={product.image} alt={product.title} className="product-image" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div className="delete-product">
                <img src={trash} alt="Trash" onClick={() => handleDelete(product._id)} />
            </div>
        </div>
    )
}

export default CartCard;