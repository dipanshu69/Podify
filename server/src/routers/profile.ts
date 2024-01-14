import { getPublicPlayList, getPublicProfile, getPublicUploads, getRecommendedByProfile, getUploads, updateFollower } from "#/controllers/profile";
import { isAuth, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/update-follower/:profiledId", mustAuth, updateFollower);
router.get("/uploads", mustAuth, getUploads);
router.get("/uploads/:profileId", getPublicUploads);
router.get("/info/:profileId", getPublicProfile);
router.get("/playList/:profileId", getPublicPlayList);
router.get("/recommended", isAuth,  getRecommendedByProfile)



export default router;
