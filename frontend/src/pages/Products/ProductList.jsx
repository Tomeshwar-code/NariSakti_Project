// import { useEffect, useState } from "react";
// import { getProducts } from "../../services/productServices";
// import ProductCard from "../../components/product/ProductCard";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     const res = await getProducts();
//     setProducts(res.data.products);
//   };

//   return (
//     <div>
//       <h1>All Products</h1>

//       <div className="product-grid">
//         {products.map((product) => (
//           <ProductCard
//             key={product._id}
//             product={product}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductList;
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productServices"; // यह आपकी existing function है
import ProductCard from "../../components/product/ProductCard";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState(""); // "price" या "-price" (अपने API के अनुसार)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // params object – axios इसे /products?key=value में बदल देगा
      const params = {
        search: searchTerm || undefined,
        category: category || undefined,
        sort: sortOption || undefined,
        page: page,
        limit: 12,
      };

      // साफ़ करें undefined values (ताकि URL में ?search= न आए)
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await getProducts(params); // axios response
      const data = response.data; // आपकी API क्या return करती है?

      // मान लें कि API { products: [], totalPages: 2, categories: [] } return करती है
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setCategories(data.categories || []);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // जब भी search, category, sort बदले → पहले पेज पर लाएँ
  useEffect(() => {
    fetchProducts(1);
  }, [searchTerm, category, sortOption]);

  // पेज बदलने पर
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setSortOption("");
    setCurrentPage(1);
  };

  // Loading, Error, Empty states...
  if (loading && products.length === 0) {
    return (
      <div className="product-list-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={() => fetchProducts(currentPage)} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <h1 className="page-title">All Products</h1>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="filter-select"
          >
            <option value="">Sort by</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>

          <button className="clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <span className="empty-icon">📦</span>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search.</p>
          <button onClick={clearFilters} className="back-btn">Reset Filters</button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ◀ Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;