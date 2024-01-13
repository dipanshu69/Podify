import { getHistory, getRecentlyPlayed, removeHistory, upDateHistory } from "#/controllers/history";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validators";
import { updateHistorySchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();


router.post("/", mustAuth, validate(updateHistorySchema), upDateHistory);
router.delete("/", mustAuth, removeHistory);
router.get("/", mustAuth, getHistory);
router.get("/recently-played", mustAuth, getRecentlyPlayed)

export default router;