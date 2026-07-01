import { useState, useRef } from "react";
import { useContext } from "react";
import { ProductContext } from "../context/productContext.jsx";
import { authenticateContext } from "../context/authenticateContext.jsx";
const ProductForm = () => {
    const { dispatch } = useContext(ProductContext);
    
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    
    const [errorFields, setErrorFields] = useState([]);
    const { user } = useContext(authenticateContext);

    const fileInputRef = useRef(null);

    const submitProduct = async (e) => {

        e.preventDefault();

        if (!user) {
            return setErrorFields(["Must be logged in"]);
        }


        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/store/`, {
            method:"POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        if (!response.ok) {
            const json = await response.json();
            setErrorFields(json.errorFields || []);
        }
        else {
            setErrorFields([]);
            setDescription('');
            setTitle('');
            setPrice('');
            setQuantity('');
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // resets to "No File Chosen" instead of the file recently selected
            }
            const product = await response.json();
            dispatch({type: "ADD_PRODUCT", payload: product});
        }
        
    }
    
    return (
        <form className="admin-form">
            <div className="form-group">
                <label>Title:</label>
                <input type="text" placeholder="Burger" onChange={(e) => {setTitle(e.target.value)}} value={title} className={errorFields.includes("title") ? "error" : ""}/>
            </div>

            <div className="form-group">
                <label>Description:</label>
                <input type="text" placeholder="Contains tomatos, hamburger, cheese and pickles" onChange={(e) => {setDescription(e.target.value)}} value={description} className={errorFields.includes("description") ? "error" : ""}/>
            </div>

            <div className="form-group">
                <label>Price ($): </label>
                <input type="number" placeholder="2.99" onChange={(e) => {setPrice(e.target.value)}} value={price} className={errorFields.includes("price") ? "error" : ""}/>
            </div>

            <div className="form-group">
                <label>Quantity:</label>
                <input type="number" placeholder="3" onChange={(e) => {setQuantity(e.target.value)}} value={quantity} className={errorFields.includes("quantity") ? "error" : ""}/>
            </div>

            <div className="form-group">
                <label>Product Image:</label>
                <input type="file" id="test" onChange={(e) => {setImage(e.target.files[0])}} ref={fileInputRef} className={errorFields.includes("image") ? "error" : ""}/>
            </div>
            <button className="admin-button" onClick={submitProduct}>Add</button>
            {errorFields.length > 0 && 
                (
                    errorFields[0] === "Must be logged in" ? "Must be logged in" : 
                    (
                        errorFields[0] === "image" ? <div className="form-error-msg">Image Already Exists</div> : <div className="form-error-msg">Fill in the following: {errorFields.join(", ")}</div>
                    )
                )
            }
        </form>
    )

}

export default ProductForm;