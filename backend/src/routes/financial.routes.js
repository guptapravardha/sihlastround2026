import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  summary,
} from "../controllers/financialController.js";

const router = Router();
router.use(requireAuth);

router.get("/summary", summary);
router.get("/", listRecords);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;
