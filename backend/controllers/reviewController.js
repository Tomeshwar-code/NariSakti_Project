const Review = require('../models/ReviewModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');

const updateProductReviewStats = async productId => {
  const reviews = await Review.find({ product: productId, status: 'approved' });
  const totalReviews = reviews.length;
  const ratingsSum = reviews.reduce((sum, review) => sum + review.rating, 0);

  const reviewCount = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  reviews.forEach(review => {
    reviewCount[review.rating] += 1;
  });

  const ratings = totalReviews === 0 ? 0 : Number((ratingsSum / totalReviews).toFixed(1));

  await Product.findByIdAndUpdate(
    productId,
    {
      ratings,
      totalReviews,
      reviewCount
    },
    { new: true }
  );
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id, status: 'approved' })
      .populate({ path: 'user', select: 'firstName lastName profileImage' })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { product: productId, rating, title, comment, order } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ success: false, message: 'Product, rating, title and comment are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    let isVerifiedPurchase = false;
    if (order) {
      const orderDocument = await Order.findOne({
        _id: order,
        user: req.user._id,
        'items.product': productId,
        paymentStatus: 'completed'
      });

      if (orderDocument) {
        isVerifiedPurchase = true;
      }
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      order,
      rating,
      title,
      comment,
      isVerifiedPurchase,
      status: 'approved'
    });

    await updateProductReviewStats(productId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    review.rating = req.body.rating ?? review.rating;
    review.title = req.body.title ?? review.title;
    review.comment = req.body.comment ?? review.comment;
    if (req.body.images) {
      review.images = req.body.images;
    }

    await review.save();
    await updateProductReviewStats(review.product);

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.remove();
    await updateProductReviewStats(review.product);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markReviewHelpful = async (req, res) => {
  try {
    const { action = 'helpful' } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (action === 'notHelpful') {
      review.notHelpful += 1;
    } else {
      review.helpful += 1;
    }

    await review.save();
    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
