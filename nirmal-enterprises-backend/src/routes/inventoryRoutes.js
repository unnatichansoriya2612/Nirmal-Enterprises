import { Router } from "express";

import {
  getInventory,
  createInventory,
  updateInventory,
} from "../controllers/inventoryController.js";

import {
  requireAuth,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, getInventory);
router.post("/", requireAuth, requireAdmin, createInventory);
router.patch("/:id", requireAuth, requireAdmin, updateInventory);

export default router;