import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  requireAuth,
  requireAdmin,
  optionalAuth,
} from "../middleware/authMiddleware.js";

const router = Router();

// 1. Create Order (Customer online checkout or Admin counter sale)
router.post("/", optionalAuth, createOrder);

// 2. Customer view their own orders
router.get("/my-orders", requireAuth, getMyOrders);

// 3. Admin view all orders
router.get("/", requireAuth, requireAdmin, getOrders);

// 4. View single order
router.get("/:id", requireAuth, getOrderById);

// 5. Admin update order status (Pending -> Processing -> Completed)
router.patch("/:id", requireAuth, requireAdmin, updateOrderStatus);

export default router;