// import { Link } from "react-router-dom";

// const ProductCard = ({ product }) => {
//   return (
//     <article className="card product-card">
//       <img
//         src={product.images[0]?.url}
//         alt={product.name}
//       />

//       <h3>{product.name}</h3>

//       <p>₹{product.price}</p>

//       <Link to={`/product/${product._id}`}>
//         View
//       </Link>
//     </article>
//   );
// };

// export default ProductCard;
import { Link } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import './ProductCard.css';

// Small placeholder image if product.images is missing or empty
const PLACEHOLDER_IMG = 'https://via.placeholder.com/300x300?text=No+Image';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist }) => {
  // ----- state for optimistic UI / local interactions -----
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // ----- graceful fallback if product is null/undefined -----
  if (!product) {
    return (
      <article className="card product-card skeleton">
        <div className="skeleton-img" />
        <h3 className="skeleton-text">Loading...</h3>
        <p className="skeleton-text">--</p>
        <span className="skeleton-btn" />
      </article>
    );
  }

  // destructure with default values to avoid crashes
  const {
    _id,
    name = 'Unknown Product',
    price,
    images = [],
    description = '',
  } = product;

  const imageUrl = images[0]?.url || PLACEHOLDER_IMG;
  const displayImage = imgError ? PLACEHOLDER_IMG : imageUrl;

  const handleAddToCart = async () => {
    setIsAdding(true);
    // This is where you'll later call your backend API
    // await api.addToCart(_id);
    if (onAddToCart) await onAddToCart(_id);
    setIsAdding(false);
  };

  return (
    <article className="card product-card">
      {/* ---- image with error fallback ---- */}
      <div className="product-card__image-wrapper">
        <img
          src={displayImage}
          alt={name}
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {/* quick actions overlay (wishlist) */}
        <button
          className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
          onClick={() => onToggleWishlist && onToggleWishlist(_id)}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? '❤️' : '🤍'}
        </button>
      </div>

      {/* ---- product info ---- */}
      <h3 className="product-card__name">{name}</h3>

      {/* price format (fallback if price is missing) */}
      <p className="product-card__price">
        {price != null ? `₹${price.toLocaleString('en-IN')}` : 'Price unavailable'}
      </p>

      {/* optional short description */}
      {description && (
        <p className="product-card__desc">
          {description.length > 80
            ? `${description.substring(0, 80)}...`
            : description}
        </p>
      )}

      {/* ---- action buttons ---- */}
      <div className="product-card__actions">
        <Link to={`/product/${_id}`} className="btn btn-view">
          View Details
        </Link>

        <button
          className="btn btn-cart"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
};

// ---- Prop types help later when connecting to backend -----
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    price: PropTypes.number,
    images: PropTypes.arrayOf(
      PropTypes.shape({ url: PropTypes.string })
    ),
    description: PropTypes.string,
  }),
  onAddToCart: PropTypes.func,
  onToggleWishlist: PropTypes.func,
  isInWishlist: PropTypes.bool,
};

export default ProductCard;