// server/routes/employeeRoutes.js
import { Router } from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import protect from "../middleware/protect.js";

const router = Router();

router.route("/").get(protect, getEmployees).post(protect, createEmployee);

router.route("/").post(protect, createEmployee);

router
  .route("/:id")
  .get(protect, getEmployeeById)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

export default router;
