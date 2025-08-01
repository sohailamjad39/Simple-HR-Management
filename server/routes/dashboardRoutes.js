// server/routes/dashboardRoutes.js
import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import protect from "../middleware/protect.js";

const router = Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard overview stats
// @access  Private
router.get("/stats", protect, getDashboardStats);

export default router;