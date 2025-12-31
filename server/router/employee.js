import express from "express";
import { verifyUser } from "../middleware/authMiddlleware.js";
import { uploadProfileImage } from "../middleware/uploadMiddleware.js";
import {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

// All employee routes require authentication
router.post("/add", verifyUser, uploadProfileImage, addEmployee);
router.get("/", verifyUser, getEmployees);
router.get("/:id", verifyUser, getEmployee);
router.put("/:id", verifyUser, uploadProfileImage, updateEmployee);
router.delete("/:id", verifyUser, deleteEmployee);

export default router;

