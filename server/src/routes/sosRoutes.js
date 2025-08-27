import express from "express";
import { activateSos, resolveSos, getSosHistory, getAllActiveSos } from "../controllers/sosController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js"

const router = express.Router();

// Trigger SOS
router.post("/activate", protect, activateSos);

// Resolve SOS
router.put("/:sosId/resolve", protect, resolveSos);

// Get SOS history
router.get("/history", protect, getSosHistory);


// Admins or emergency
router.get("/emergency/all", protect, authorizeRole("admin", "emergency"), getAllActiveSos);


export default router;
