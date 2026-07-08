
import "./HomePage.css";
import { useEffect, useState } from 'react';
import { getProducts } from '../../services/productServices';
import ProductCard from '../../components/product/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="home-page">
      <h1>Featured Products</h1>
      <div className="product-grid">
        {products.slice(0, 12).map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;