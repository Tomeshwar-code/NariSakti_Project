import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <img
        src={product.images[0]?.url}
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>

      <Link to={`/product/${product._id}`}>
        View
      </Link>
    </div>
  );
};

export default ProductCard;