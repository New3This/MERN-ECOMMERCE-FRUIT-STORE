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
        if (image) {
            formData.append('image', image);
        }

        const response = await fetch("http://localhost:4000/api/store/", {
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
            setTitle('');
            setPrice('');
            setQuantity('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            const product = await response.json();
            dispatch({type: "ADD_PRODUCT", payload: product});
        }
        
    }
    
    return (
        <form className="admin-form">
            <label>Title:</label>
            <input type="text" onChange={(e) => {setTitle(e.target.value)}} value={title} className={errorFields.includes("title") ? "error" : ""}/>
            <label>Price:</label>
            <input type="number" onChange={(e) => {setPrice(e.target.value)}} value={price} className={errorFields.includes("price") ? "error" : ""}/>
            <label>Quantity:</label>
            <input type="number" onChange={(e) => {setQuantity(e.target.value)}} value={quantity} className={errorFields.includes("quantity") ? "error" : ""}/>
            <label>Product Image:</label>
            <input type="file" onChange={(e) => {setImage(e.target.files[0])}} ref={fileInputRef}/>
            <button className="admin-button" onClick={submitProduct}>Add</button>
            {errorFields.length > 0 && 
                (
                    errorFields[0] === "Must be logged in" ? "Must be logged in" : <div className="form-error-msg">Fill in the following: {errorFields.join(", ")}</div>
                )
            }
        </form>
    )

}

export default ProductForm;