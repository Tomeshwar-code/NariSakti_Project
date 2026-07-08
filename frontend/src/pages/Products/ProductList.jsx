import { useEffect, useState } from "react";
import { getProducts } from "../../services/productServices";
import ProductCard from "../../components/product/ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data.products);
  };

  return (
    <div>
      <h1>All Products</h1>

      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductList;