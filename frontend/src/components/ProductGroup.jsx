import trash from "../assets/trash.svg";
import {useContext} from "react";
import { ProductContext } from "../context/productContext.jsx";

const ProductGroup = ({product}) => {

    const { dispatch } = useContext(ProductContext);


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/store/${product._id}`, {
                method:"DELETE"
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
                <p className="product-creation">Creation Date:{product.createdAt}</p>
                <p className="product-creation">Product ID:{product._id}</p>

            </div>
            <div className="delete-product">
                <img src={trash} alt="Trash" onClick={handleDelete} />
            </div>
        </div>
    )
}

export default ProductGroup;