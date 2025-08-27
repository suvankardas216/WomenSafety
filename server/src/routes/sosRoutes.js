import express from "express";
import { activateSos, resolveSos, getSosHistory } from "../controllers/sosController.js";
import { protect } from "../middleware/authMiddleware.js"; // assuming JWT auth

const router = express.Router();

// Trigger SOS
router.post("/activate", protect, activateSos);

// Resolve SOS
router.put("/:sosId/resolve", protect, resolveSos);

// Get SOS history
router.get("/history", protect, getSosHistory);

export default router;
