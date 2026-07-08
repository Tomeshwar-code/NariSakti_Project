import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../services/productServices";
import ProductReviews from "../../components/product/ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProduct(id);
      setProduct(res.data.product);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load product.");
    }
  };

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!product) return <h1>Loading...</h1>;

  return (
    <div className="product-details-page">
      <div className="product-summary">
        <img src={product.images[0]?.url} alt={product.name} />

        <div className="product-information">
          <h1>{product.name}</h1>
          <h3>₹{product.price}</h3>
          <p>{product.description}</p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
        </div>
      </div>

      <ProductReviews productId={product._id} />
    </div>
  );
};

export default ProductDetails;