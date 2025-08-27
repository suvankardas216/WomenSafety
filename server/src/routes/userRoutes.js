import express from "express";
import { addTrustedContacts } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addContacts", protect, addTrustedContacts);

export default router;