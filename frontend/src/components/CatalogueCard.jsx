import { useNavigate } from "react-router-dom";
import { authenticateContext } from "../context/authenticateContext.jsx";
import { useContext } from "react";
import bin from "../assets/trash.svg";

const CatalogueCard = ({product, handleDelete}) => {

    const navigate = useNavigate();
    const { user } = useContext(authenticateContext);

    const viewProductInstance = () => {
        navigate(`/product/${product._id}`);
    }

    const addToCart = async () => {

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
                const json = await response.json();
                throw new Error("Failed to POST");
            }

            console.log(await response.json());
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="catalogue-card">
            <img src={product.image} alt={product.title} style={{width: "200px", height: "200px"}} />
            <h2>{product.title}</h2>
            <p>{product.price}</p>
            <button onClick={viewProductInstance}>More Details</button>
            <button onClick={addToCart}>Add to Cart</button>
            {user.role !== "customer" && <img src={bin} alt="delete-icon" onClick={() => handleDelete(product)}/>}
        </div>
    )
}   

export default CatalogueCard;