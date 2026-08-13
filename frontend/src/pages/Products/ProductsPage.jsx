// import { useEffect, useState } from 'react';
// import { getProducts } from '../../services/productServices';
// import ProductCard from '../../components/product/ProductCard';

// function ProductsPage() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await getProducts();
//         setProducts(res.data.products || []);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Products</h1>
//       {products.length === 0 ? (
//         <p>No products available.</p>
//       ) : (
//         <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
//           {products.map(product => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProductsPage
import { useEffect, useState } from 'react';
import { getProducts } from '../../services/productServices';
import ProductCard from '../../components/product/ProductCard';
import './ProductsPage.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: searchTerm || undefined,
        category: category || undefined,
        sort: sortOption || undefined,
        page,
        limit: 12,
      };
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const res = await getProducts(params);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setCategories(res.data.categories || []);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [searchTerm, category, sortOption]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setSortOption('');
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="products-page-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={() => fetchProducts(currentPage)} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">
          Products <small>curated for you</small>
        </h1>

        {/* New Professional Search Bar */}
        <div className="search-wrapper">
          <span className="search-icon">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear visible"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
          <button className="search-submit" onClick={() => fetchProducts(1)}>
            <i className="fas fa-arrow-right"></i> Search
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Sort</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="filter-select"
          >
            <option value="">Relevance</option>
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
          </select>
        </div>

        <button className="clear-btn" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <span className="empty-icon">📦</span>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters.</p>
          <button onClick={clearFilters} className="back-btn">
            Reset Filters
          </button>
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
                Previous
              </button>
              <span className="page-info">
                {currentPage} / {totalPages}
              </span>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductsPage;