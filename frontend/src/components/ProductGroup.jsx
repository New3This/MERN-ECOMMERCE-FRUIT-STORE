import trash from "../assets/trash.svg";
import { useContext } from "react";
import { ProductContext } from "../context/productContext.jsx";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { authenticateContext } from "../context/authenticateContext.jsx";

const ProductGroup = ({product}) => {

    const { dispatch } = useContext(ProductContext);
    const { user } = useContext(authenticateContext);

    const handleDelete = async () => {

        if (!user) {
            return
        }
        try {
            const response = await fetch(`http://localhost:4000/api/store/${product._id}`, {
                method:"DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Fetch failed!");
            }

            else {
                const json = await response.json();
                dispatch({type: "DELETE_PRODUCT", payload: json});
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="ProductGroup">
            <div className="product-description">
                <p className="product-title">{product.title}</p>
                <p className="product-price"><strong>Price:</strong> {product.price}</p>
                <p className="product-quantity"><strong>Quantity:</strong> {product.quantity}</p>
                <p className="product-creation">Created {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}</p>
            </div>
            <div className="delete-product">
                <img src={trash} alt="Trash" onClick={handleDelete} />
            </div>
        </div>
    )
}

export default ProductGroup;