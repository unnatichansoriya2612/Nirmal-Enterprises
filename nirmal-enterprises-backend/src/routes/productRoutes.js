import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
} from "../controllers/productController.js";

import {
  requireAuth,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

// Public: list active products
router.get("/", getProducts);

// Public: view an active product
router.get("/:id", getProductById);

// Admin only: create a product
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createProduct
);

// Admin only: update a product
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateProduct
);

// Admin only: deactivate a product
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deactivateProduct
);

export default router;
