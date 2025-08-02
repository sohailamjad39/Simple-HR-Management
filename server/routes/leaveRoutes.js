// server/routes/leaveRoutes.js
import { Router } from "express";
import {
  getLeaves,
  createLeave,
  updateLeaveStatus,
  updateLeave,
  deleteLeave,
} from "../controllers/leaveController.js";
import protect from "../middleware/protect.js";

const router = Router();

/**
 * @route   GET /api/leaves
 * @desc    Get all leaves (with optional filters)
 * @access  Private
 */
router.route("/").get(protect, getLeaves);

/**
 * @route   POST /api/leaves
 * @desc    Create a new leave record
 * @access  Private
 */
router.route("/").post(protect, createLeave);

/**
 * @route   PATCH /api/leaves/:id/status
 * @desc    Update leave status (Approve/Reject)
 * @access  Private
 */
router.route("/:id/status").patch(protect, updateLeaveStatus);

// Edit leave (PATCH /api/leaves/:id)
router.route("/:id").patch(protect, updateLeave);

// Delete leave (DELETE /api/leaves/:id)
router.route("/:id").delete(protect, deleteLeave);

export default router;