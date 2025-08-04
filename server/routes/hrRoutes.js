// server/routes/hrRoutes.js
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/hrController.js";
import protect from "../middleware/protect.js";

const router = Router();

router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router;