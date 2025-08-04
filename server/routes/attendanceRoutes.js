// server/routes/attendanceRoutes.js
import { Router } from "express";
import {
  getDailyAttendance,
  addManualAttendance,
  getMonthlyReport,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";
import protect from "../middleware/protect.js";

const router = Router();

router.route("/daily").get(protect, getDailyAttendance);
router.route("/manual").post(protect, addManualAttendance);
router.route("/monthly").get(protect, getMonthlyReport);
router.route("/:id").patch(protect, updateAttendance);
router.route("/:id").delete(protect, deleteAttendance);

export default router;