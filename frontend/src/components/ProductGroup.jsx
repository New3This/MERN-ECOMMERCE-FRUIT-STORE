import trash from "../assets/trash.svg";
import edit from "../assets/edit.png";

import { useContext, useState } from "react";
import { ProductContext } from "../context/productContext.jsx";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { authenticateContext } from "../context/authenticateContext.jsx";

const ProductGroup = ({product}) => {

    const { dispatch } = useContext(ProductContext);
    const { user } = useContext(authenticateContext);

    const [editOn, setEditOn] = useState(false);
    const [editTitle, setEditTitle] = useState(product.title);
    const [editPrice, setEditPrice] = useState(product.price);
    const [editQuantity, setEditQuantity] = useState(product.quantity);
    const [editImage, setEditImage] = useState(null);

    const handleEdit = async (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('price', editPrice);
        formData.append('quantity', editQuantity);
        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            const response = await fetch(`http://localhost:4000/api/store/update/${product._id}`, {
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
            {!editOn ? (
                <div className="product-description">
                    <p className="product-title">{product.title}</p>
                    <p className="product-price"><strong>Price:</strong> {product.price}</p>
                    <p className="product-quantity"><strong>Quantity:</strong> {product.quantity}</p>
                    <p className="product-creation">Created {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}</p>
                    <img src={product.image} alt={product.title} className="product-image" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>)
                
                :

                <form className="product-description" onSubmit={handleEdit}>
                    <label>Product Title:</label>
                    <input onChange={(e) => setEditTitle(e.target.value)} value={editTitle}></input>

                    <label>Product Price:</label>
                    <input type="number" onChange={(e) => setEditPrice(e.target.value)} value={editPrice}></input>

                    <label>Product Quantity:</label>
                    <input type="number" onChange={(e) => setEditQuantity(e.target.value)} value={editQuantity}></input>

                    <label>Product Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])}></input>

                    <button type="submit">Submit</button>
                </form>
            }

            <div className="delete-product">
                <img src={trash} alt="Trash" onClick={handleDelete} />
                <img src={edit} alt="Edit" onClick={() => setEditOn(true)} />
            </div>
        </div>
    )
}

export default ProductGroup;