import {
  create,
  generateForgetPassWord,
  grantValid,
  sendReVerificationToken,
  signIn,
  updatePassWord,
  verifyEmail,
} from "#/controllers/user";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validators";
import {
  CreateUserSchema,
  TokenAndIdValidation,
  signInValidationSchema,
  updatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";

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
router.get("/is-auth", mustAuth, (req, res) => {
  res.json({
    profile: req.user,
  });
});
router.get("/public", (req, res) => {
  res.json({
    message: "You are in Public route.",
  });
});
router.get("/private", mustAuth, (req, res) => {
  res.json({
    profile: "You are in Private route",
  });
});

export default router;
