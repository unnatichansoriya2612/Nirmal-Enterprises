import { Router } from "express";

import {
  bookService,
  getAllServices,
  getMyServices,
  updateService,
} from "../controllers/serviceController.js";
import {
  requireAuth,
  requireAdmin,
  optionalAuth,
} from "../middleware/authMiddleware.js";

const router = Router();

// 1. Book a new service (Public or logged-in customer)
router.post("/", optionalAuth, bookService);

// 2. Customer view their own service history
router.get("/my-services", requireAuth, getMyServices);

// 3. Admin view all services
router.get("/", requireAuth, requireAdmin, getAllServices);

// 4. Admin update a service ticket (assign technician, update status, payment)
router.patch("/:id", requireAuth, requireAdmin, updateService);

export default router;
