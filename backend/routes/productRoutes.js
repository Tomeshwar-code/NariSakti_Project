const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sellerOnly } = require('../middleware/sellerMiddleware');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(protect, sellerOnly, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, sellerOnly, updateProduct)
  .delete(protect, sellerOnly, deleteProduct);

module.exports = router;