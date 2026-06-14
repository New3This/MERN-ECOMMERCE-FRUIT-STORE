import empty from "../assets/empty.png";
import { useNavigate } from "react-router-dom";
const CatalogueCard = ({product}) => {
    const navigate = useNavigate();
    const viewProductInstance = () => {
        navigate(`/product/${product._id}`);
    }

    return (
        <div className="catalogue-card">
            <img src={empty} alt={product.title} style={{width: "200px", height: "200px"}} />
            <h2>{product.title}</h2>
            <p>{product.price}</p>
            <button onClick={viewProductInstance}>More Details</button>
        </div>
    )
}   

export default CatalogueCard;