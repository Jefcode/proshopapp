import express from 'express';
import {
  getProduct,
  getAllProducts,
  deleteProductById,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(getProduct)
  .delete(protect, admin, deleteProductById)
  .put(protect, admin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
