import { useNavigate } from "react-router-dom";
import { authenticateContext } from "../context/authenticateContext.jsx";
import { useContext } from "react";
import bin from "../assets/trash.png";
import currencyFormatter from "../utility/currencyFormatter.jsx";
import noImage from "../assets/noImage.png";

const CatalogueCard = ({product, handleDelete, userDispatch, setOpenCart}) => {

    const navigate = useNavigate();
    const { user } = useContext(authenticateContext);

    const viewProductInstance = () => {
        navigate(`/product/${product._id}`);
    }

    const addToCart = async () => {
        setOpenCart?.(true);
        try {
            const response = await fetch("http://localhost:4000/api/store/addToCart", {
                method: "POST",
                body: JSON.stringify({productID: product._id}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }}
            )

            if (!response.ok) {
                throw new Error("Failed to POST");
            }

            const updatedUser = await response.json();
            const userPlusToken = {...updatedUser, token: user.token}
            localStorage.setItem('user', JSON.stringify(userPlusToken));

            userDispatch({ type: 'LOGIN', payload: userPlusToken });
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="catalogue-card">
            <img src={product.image ? product.image : noImage} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{currencyFormatter(product.price)}</p>
            <div className="catalogue-buttons-container">
                <button onClick={viewProductInstance} className="catalogue-buttons">More Details</button>
                <button onClick={addToCart} className="catalogue-buttons">Add to Cart</button>
            </div>
            {user.role !== "customer" && <button alt="delete-icon" onClick={() => handleDelete(product)} className="catalogue-card-remove">Remove</button>}

        </div>
    )
}   

export default CatalogueCard;