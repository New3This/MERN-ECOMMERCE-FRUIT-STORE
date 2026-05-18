import {useState} from "react";
import { useContext } from "react";
import { ProductContext } from "../context/productContext.jsx";

const ProductForm = () => {
    const { dispatch } = useContext(ProductContext);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');


    const submitProduct = async (e) => {

        e.preventDefault();

        const productItem = {
            title: title,
            price: price,
            quantity: quantity
        }

        
            const response = await fetch("http://localhost:4000/api/store/", {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productItem)
            })

            if (!response.ok) {
                throw new Error("Couldn't POST");
            }
            else {
                setTitle('');
                setPrice('');
                setQuantity('');
                dispatch({type: "UPDATE_PRODUCT", payload: productItem});
            }
        


    }
    
    return (
        <form className="admin-form">
            <label>Title:</label>
            <input type="text" onChange={(e) => {setTitle(e.target.value)}} value={title}/>
            <label>Price:</label>
            <input type="text" onChange={(e) => {setPrice(e.target.value)}} value={price}/>
            <label>Quantity:</label>
            <input type="text" onChange={(e) => {setQuantity(e.target.value)}} value={quantity}/>
            <button className="admin-button" onClick={submitProduct} disabled={!title || !price || !quantity}>Add</button>
        </form>
    )

}

export default ProductForm;