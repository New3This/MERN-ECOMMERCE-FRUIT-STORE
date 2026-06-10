import { useState } from "react";
import { useContext } from "react";
import { ProductContext } from "../context/productContext.jsx";
import { authenticateContext } from "../context/authenticateContext.jsx";
const ProductForm = () => {
    const { dispatch } = useContext(ProductContext);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const { user } = useContext(authenticateContext);

    const submitProduct = async (e) => {

        e.preventDefault();

        if (!user) {
            return setErrorFields(["Must be logged in"]);
        }


        const productItem = {
            title: title,
            price: price,
            quantity: quantity
        }

        const response = await fetch("http://localhost:4000/api/store/", {
            method:"POST",
            body: JSON.stringify(productItem),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        if (!response.ok) {
            const json = await response.json();
            setErrorFields(json.errorFields);
        }
        else {
            setErrorFields([]);
            setTitle('');
            setPrice('');
            setQuantity('');
            const product = await response.json();
            dispatch({type: "ADD_PRODUCT", payload: product});
        }
        
    }
    
    return (
        <form className="admin-form">
            <label>Title:</label>
            <input type="text" onChange={(e) => {setTitle(e.target.value)}} value={title} className={errorFields.includes("title") ? "error" : ""}/>
            <label>Price:</label>
            <input type="text" onChange={(e) => {setPrice(e.target.value)}} value={price} className={errorFields.includes("price") ? "error" : ""}/>
            <label>Quantity:</label>
            <input type="text" onChange={(e) => {setQuantity(e.target.value)}} value={quantity} className={errorFields.includes("quantity") ? "error" : ""}/>
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