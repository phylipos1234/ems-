import express from "express";
import { register, login, changePassword } from "../controllers/authController.js";
import { verifyUser } from "../middleware/authMiddlleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyUser, changePassword);

export default router;
