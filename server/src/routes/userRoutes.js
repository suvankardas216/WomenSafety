import express from "express";
import { addTrustedContacts, getTrustedContacts, updateTrustedContact, deleteTrustedContact } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addContacts", protect, addTrustedContacts);
router.get("/getContacts", protect, getTrustedContacts);
router.put("/update/:contactId", protect, updateTrustedContact);
router.delete("/delete/:contactId", protect, deleteTrustedContact);

export default router;