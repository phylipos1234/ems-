import express from "express";
import { verifyUser } from "../middleware/authMiddlleware.js";
import {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";

const router = express.Router();

// All department routes require authentication
router.post("/add", verifyUser, addDepartment);
router.get("/", verifyUser, getDepartments);
router.get("/:id", verifyUser, getDepartment);
router.put("/:id", verifyUser, updateDepartment);
router.delete("/:id", verifyUser, deleteDepartment);

export default router;