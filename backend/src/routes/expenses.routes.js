import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = Router();
router.use(requireAuth);

router.get("/", listExpenses);
router.post("/", createExpense);
router.get("/:id", getExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
