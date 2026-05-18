const ProductGroup = ({product}) => {
    return (
        <div className="ProductGroup">
            <p className="product-title">{product.title}</p>
            <p className="product-price"><strong>Price:</strong> {product.price}</p>
            <p className="product-quantity"><strong>Quantity:</strong> {product.quantity}</p>
            <p className="product-creation">Creation Date:{product.createdAt}</p>
        </div>
    )
}

export default ProductGroup;