const ProductGroup = ({product}) => {
    return (
        <div className="ProductGroup">
            <h4 className="product-title">{product.title}</h4>
            <p className="product-price">{product.price}</p>
            <p className="product-quantity">{product.quantity}</p>
            <p className="product-creation">{product.createdAt}</p>
        </div>
    )
}

export default ProductGroup;