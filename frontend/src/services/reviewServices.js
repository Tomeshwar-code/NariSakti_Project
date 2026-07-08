import axios from '../api/axios';

export const getProductReviews = (productId) => {
  return axios.get(`/reviews/product/${productId}`);
};

export const createReview = (data) => {
  return axios.post('/reviews', data);
};

export const markReviewHelpful = (reviewId, action = 'helpful') => {
  return axios.post(`/reviews/${reviewId}/helpful`, { action });
};
