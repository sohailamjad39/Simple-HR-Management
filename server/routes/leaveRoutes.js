// server/routes/leaveRoutes.js
import { Router } from "express";
import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import protect from "../middleware/protect.js";

const router = Router();

// @route    GET /api/leaves
router.route("/").get(protect, getLeaveRequests);

// @route    POST /api/leaves
router.route("/").post(protect, createLeaveRequest);

// @route    PATCH /api/leaves/:id/approve
router.route("/:id/approve").patch(protect, (req, res) => {
  req.body.status = "Approved";
  updateLeaveStatus(req, res);
});

// @route    PATCH /api/leaves/:id/reject
router.route("/:id/reject").patch(protect, (req, res) => {
  req.body.status = "Rejected";
  updateLeaveStatus(req, res);
});

export default router;