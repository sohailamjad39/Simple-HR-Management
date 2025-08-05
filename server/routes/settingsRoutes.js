// server/routes/settingsRoutes.js
import { Router } from "express";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getDesignations,
  getLeaveTypes,
  addLeaveType,
  addDesignation,
  updateDesignation,
  deleteDesignation,
  changePassword,
} from "../controllers/settingsController.js";
import protect from "../middleware/protect.js";

const router = Router();

// --- DEPARTMENTS ---
router
  .route("/departments")
  .get(protect, getDepartments)
  .post(protect, addDepartment);

router
  .route("/departments/:id")
  .put(protect, updateDepartment)
  .delete(protect, deleteDepartment);

// --- DESIGNATIONS ---
router
  .route("/designations")
  .get(protect, getDesignations)
  .post(protect, addDesignation);

router
  .route("/designations/:id")
  .put(protect, updateDesignation)
  .delete(protect, deleteDesignation);

// --- LEAVE TYPES ---
router
  .route("/leave-types")
  .get(protect, getLeaveTypes)
  .post(protect, addLeaveType);

router.route("/change-password").post(protect, changePassword);

export default router;
