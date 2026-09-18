import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listSales, getSale, createSale, updateSale, deleteSale } from "../controllers/salesController.js";

const router = Router();
router.use(requireAuth);

router.get("/", listSales);
router.post("/", createSale);
router.get("/:id", getSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
