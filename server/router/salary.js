import express from "express";
import { verifyUser } from "../middleware/authMiddlleware.js";
import {
  addSalary,
  getSalaries,
  getSalary,
  updateSalary,
  deleteSalary
} from "../controllers/salaryController.js";

const router = express.Router();

// All salary routes require authentication
router.post("/add", verifyUser, addSalary);
router.get("/", verifyUser, getSalaries);
router.get("/:id", verifyUser, getSalary);
router.put("/:id", verifyUser, updateSalary);
router.delete("/:id", verifyUser, deleteSalary);

export default router;



