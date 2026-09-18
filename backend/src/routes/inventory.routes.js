import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  stockIn,
  stockOut,
  adjustStock,
  lowStock,
  valuation,
  listTransactions,
} from "../controllers/inventoryController.js";

const router = Router();
router.use(requireAuth);

// Static/specific paths first so they aren't swallowed by "/:id".
router.get("/low-stock", lowStock);
router.get("/valuation", valuation);
router.get("/transactions", listTransactions);

router.get("/", listItems);
router.post("/", createItem);
router.get("/:id", getItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.post("/:id/stock-in", stockIn);
router.post("/:id/stock-out", stockOut);
router.post("/:id/adjust", adjustStock);

export default router;
