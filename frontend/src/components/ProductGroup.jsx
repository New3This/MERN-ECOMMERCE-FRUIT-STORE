import trash from "../assets/trash.png";
import edit from "../assets/edit.png";
import noImage from "../assets/noImage.png";

import { useContext, useState } from "react";
import { ProductContext } from "../context/productContext.jsx";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { authenticateContext } from "../context/authenticateContext.jsx";

const ProductGroup = ({product}) => {

    const { dispatch } = useContext(ProductContext);
    const { user } = useContext(authenticateContext);

    const [editOn, setEditOn] = useState(false);
    const [editTitle, setEditTitle] = useState(product.title);
    const [editDescription, setEditDescription] = useState(product.description);
    const [editPrice, setEditPrice] = useState(product.price);
    const [editQuantity, setEditQuantity] = useState(product.quantity);
    const [editImage, setEditImage] = useState(null);

    const handleEdit = async (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        formData.append('price', editPrice);
        formData.append('quantity', editQuantity);
        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/update/${product._id}`, {
                method: "PATCH",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })



            if (!response.ok) {
                throw new Error("Fetch failed!");
            }

            else {
                const json = await response.json();
                setEditOn(false);
                dispatch({type: "UPDATE_PRODUCT", payload: json});
            }
        }
        
        catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async () => {

        if (!user) {
            return
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/${product._id}`, {
                method: "DELETE",
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
            <div className="delete-product">
                <img src={trash} id="delete-icon" alt="Trash" onClick={handleDelete} />
                <img src={edit}  id="edit-icon" alt="Edit" onClick={() => setEditOn(true)} />
            </div>
            {!editOn ? (
                <div className="product-description">
                    {product.image ? <img src={product.image} alt={product.title} className="product-image" /> : <img src={noImage} alt={product.title} className="product-image" />}
                    <p className="product-title">{product.title}</p>
                    <p className="product-text">Description: {product.description}</p>
                    <div className="product-extra">
                        <p className="product-price">Price: ${product.price}</p>
                        <p className="product-quantity">Quantity: {product.quantity}</p>
                    </div>
                </div>)
                
                :

                <form className="product-description" onSubmit={handleEdit}>

                    <div className="product-group">
                        <label>Product Title:</label>
                        <input onChange={(e) => setEditTitle(e.target.value)} value={editTitle}></input>
                    </div>

                    <div className="product-group">
                        <label>Product Description:</label>
                        <input onChange={(e) => setEditDescription(e.target.value)} value={editDescription}></input>
                    </div>

                    <div className="product-group">
                        <label>Product Price:</label>
                        <input type="number" onChange={(e) => setEditPrice(e.target.value)} value={editPrice}></input>
                    </div>

                    <div className="product-group">
                        <label>Product Quantity:</label>
                        <input type="number" onChange={(e) => setEditQuantity(e.target.value)} value={editQuantity}></input>
                    </div>

                    <div className="product-group">
                        <label>Product Image:</label>
                        <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])}></input>
                    </div>

                    <button type="submit">Submit</button>

                </form>
            }
        </div>
    )
}

export default ProductGroup;