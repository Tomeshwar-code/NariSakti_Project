// import { useCallback, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getProduct } from "../../services/productServices";
// import ProductReviews from "../../components/product/ProductReviews";

// const ProductDetails = () => {
//   const { id } = useParams();

//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState(null);

//   const fetchProduct = useCallback(async () => {
//     try {
//       const res = await getProduct(id);
//       setProduct(res.data.product);
//     } catch (err) {
//       setError(err.response?.data?.message || "Unable to load product.");
//     }
//   }, [id]);

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id, fetchProduct]);

//   if (error) {
//     return <h2>{error}</h2>;
//   }

//   if (!product) return <h1>Loading...</h1>;

//   return (
//     <div className="product-details-page">
//       <div className="product-summary">
//         <img src={product.images[0]?.url} alt={product.name} />

//         <div className="product-information">
//           <h1>{product.name}</h1>
//           <h3>₹{product.price}</h3>
//           <p>{product.description}</p>
//           <p>
//             <strong>Stock:</strong> {product.stock}
//           </p>
//         </div>
//       </div>

//       <ProductReviews productId={product._id} />
//     </div>
//   );
// };

// export default ProductDetails;
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../../services/productServices";
// import { addToCart } from "../../services/cartServices";
import ProductReviews from "../../components/product/ProductReviews";
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description, reviews, specs

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProduct(id);
      setProduct(res.data.product);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    return () => {
      // cleanup
    };
  }, [id, fetchProduct]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (product?.stock && newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart({ productId: product._id, quantity });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <span className="empty-icon">🔍</span>
        <h3>Product not found</h3>
        <button onClick={() => navigate('/products')} className="back-btn">Browse Products</button>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImage]?.url || 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <div className="product-details-page">
      <nav className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span className="separator">›</span>
        <span onClick={() => navigate('/products')}>Products</span>
        <span className="separator">›</span>
        <span className="current">{product.name}</span>
      </nav>

      <div className="product-container">
        {/* Left: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <img src={mainImage} alt={product.name} className="main-image" />
            {product.stock === 0 && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}
            {product.discount && (
              <div className="discount-badge">
                {product.discount}% OFF
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`${product.name} - ${index + 1}`}
                  className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          {product.brand && (
            <div className="product-brand">Brand: {product.brand}</div>
          )}
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">(0 reviews)</span>
          </div>
          <div className="product-price">
            <span className="current-price">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="compare-price">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>
          {product.stock > 0 && (
            <div className="stock-status in-stock">✅ In Stock</div>
          )}
          {product.stock === 0 && (
            <div className="stock-status out-of-stock">❌ Out of Stock</div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Quantity</label>
            <div className="quantity-control">
              <button
                className="qty-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={product.stock > 0 && quantity >= product.stock}
              >
                +
              </button>
            </div>
            <span className="stock-info">
              {product.stock > 0 && `${product.stock} units available`}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
          >
            {addingToCart ? (
              <>
                <span className="spinner-mini"></span> Adding...
              </>
            ) : cartSuccess ? (
              '✅ Added to Cart!'
            ) : (
              '🛒 Add to Cart'
            )}
          </button>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="wishlist-btn" onClick={() => alert('Wishlist feature coming soon')}>
              ♥ Wishlist
            </button>
            <button className="share-btn" onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}>
              📤 Share
            </button>
          </div>

          {/* Tabs */}
          <div className="product-tabs">
            <div className="tab-headers">
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications
              </button>
              <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'description' && (
                <p className="description-text">{product.description || 'No description available.'}</p>
              )}
              {activeTab === 'specs' && (
                <div className="specs-table">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div className="spec-row" key={key}>
                        <span className="spec-key">{key}</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p>No specifications available.</p>
                  )}
                </div>
              )}
              {activeTab === 'reviews' && (
                <ProductReviews productId={product._id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;