import { createPlayList, getAudios, getPlayListByProfile, removePlayList, updatePlayList } from "#/controllers/playList";
import { isVerified, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validators";
import { newPlayListValidationSchema, oldPlayListValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(newPlayListValidationSchema),
  createPlayList
);
router.patch(
    "/update",
    mustAuth,
    validate(oldPlayListValidationSchema),
    updatePlayList
);
router.delete("/remove", mustAuth, removePlayList);
router.get("/by-profile", mustAuth, getPlayListByProfile);
router.get("/:playlistId", mustAuth, getAudios);


export default router;
