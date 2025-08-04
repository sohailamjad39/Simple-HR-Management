// server/routes/payrollRoutes.js
import { Router } from "express";
import {
  getSalaryDetails,
  generatePayslip,
  getPayslipHistory,
} from "../controllers/payrollController.js";
import protect from "../middleware/protect.js";

const router = Router();

router.route("/salary/:id").get(protect, getSalaryDetails);
router.route("/generate").post(protect, generatePayslip);
router.route("/history/:id").get(protect, getPayslipHistory);

export default router;