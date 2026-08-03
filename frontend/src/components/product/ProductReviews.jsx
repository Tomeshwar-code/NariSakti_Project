import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createReview,
  getProductReviews,
  markReviewHelpful
} from "../../services/reviewServices";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState({ rating: 5, title: "", comment: "", order: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProductReviews(productId);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!token) {
      return navigate("/login");
    }

    if (!formState.title.trim() || !formState.comment.trim()) {
      setError("Please add both a title and a comment.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createReview({
        product: productId,
        rating: Number(formState.rating),
        title: formState.title.trim(),
        comment: formState.comment.trim(),
        order: formState.order.trim() || undefined
      });
      setFormState({ rating: 5, title: "", comment: "", order: "" });
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId, action) => {
    if (!token) {
      return navigate("/login");
    }

    try {
      await markReviewHelpful(reviewId, action);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  return (
    <section className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <p>
          {reviews.length > 0
            ? `${averageRating} average rating from ${reviews.length} review${reviews.length === 1 ? '' : 's'}`
            : 'No reviews yet. Be the first to write one.'}
        </p>
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p>No reviews available for this product.</p>
          ) : (
            reviews.map(review => (
              <article key={review._id} className="review-card">
                <div className="review-card-header">
                  <strong>
                    {review.user?.firstName || 'Customer'} {review.user?.lastName || ''}
                  </strong>
                  <span>{review.rating} / 5</span>
                </div>
                <h4>{review.title}</h4>
                <p>{review.comment}</p>
                <div className="review-card-meta">
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  <span>
                    {review.isVerifiedPurchase ? 'Verified purchase' : 'Purchase not confirmed'}
                  </span>
                </div>
                <div className="review-card-actions">
                  <button type="button" onClick={() => handleMarkHelpful(review._id, 'helpful')}>
                    Helpful ({review.helpful})
                  </button>
                  <button type="button" onClick={() => handleMarkHelpful(review._id, 'notHelpful')}>
                    Not helpful ({review.notHelpful})
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      <div className="review-form">
        <h3>Write a review</h3>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Rating
            <select name="rating" value={formState.rating} onChange={handleInputChange}>
              {[5, 4, 3, 2, 1].map(value => (
                <option key={value} value={value}>
                  {value} Star{value > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </label>

          <label>
            Review title
            <input
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              placeholder="Write a short summary"
            />
          </label>

          <label>
            Review comment
            <textarea
              name="comment"
              value={formState.comment}
              onChange={handleInputChange}
              placeholder="Tell other shoppers what you liked"
              rows={4}
            />
          </label>

          <label>
            Order ID (optional)
            <input
              name="order"
              value={formState.order}
              onChange={handleInputChange}
              placeholder="Enter order id to verify purchase"
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProductReviews;
