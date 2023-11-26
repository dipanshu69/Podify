import {
  create,
  generateForgetPassWord,
  grantValid,
  logOut,
  sendProfile,
  sendReVerificationToken,
  signIn,
  updatePassWord,
  updateProfile,
  verifyEmail,
} from "#/controllers/auth";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validators";
import {
  CreateUserSchema,
  TokenAndIdValidation,
  signInValidationSchema,
  updatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";
import fileParser from "#/middleware/fileParser";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-PassWord", generateForgetPassWord);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIdValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(updatePasswordSchema),
  isValidPassResetToken,
  updatePassWord
);
router.post("/sign-in", validate(signInValidationSchema), signIn);
router.get("/is-auth", mustAuth, sendProfile);
router.post("/update-profile", mustAuth, fileParser, updateProfile);
router.post("/log-out", mustAuth, logOut);

export default router;
