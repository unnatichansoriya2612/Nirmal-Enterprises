import { Router } from "express";

import {
  register,
  login,
  getCustomers,
  updateProfile,
} from "../controllers/authController.js";
import {
  requireAuth,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

// Public: Customer Registration
router.post("/register", register);

// Public: Login (supports Email & Mobile Number)
router.post("/login", login);

// Authenticated: Get current user profile
router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Account verified successfully.",
    data: req.profile,
  });
});

// Authenticated: Update profile
router.patch("/profile", requireAuth, updateProfile);

// Admin only: Verify admin access
router.get("/admin-check", requireAuth, requireAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin access verified successfully.",
    data: {
      fullName: req.profile.full_name,
      role: req.profile.role,
    },
  });
});

// Admin only: View all registered customers
router.get("/customers", requireAuth, requireAdmin, getCustomers);

export default router;