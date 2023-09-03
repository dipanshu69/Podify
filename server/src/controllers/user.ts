import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { RequestHandler } from "express";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendPassWordResetMail,
  sendVerificationMail,
} from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerification";
import PasswordResetToken from "#/models/passwordResetToken";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";
import passwordResetToken from "#/models/passwordResetToken";

/**
 * Create a new user.
 *
 * @param {CreateUser} req - The HTTP request containing user data.
 * @param {Response} res - The HTTP response.
 * @returns {void}
 */

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const token = generateToken(6);
  const user = await User.create({ name, email, password });

  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({
    user: {
      id: user._id,
      name,
      email,
    },
  });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid Token" });

  const matchedToken = await verificationToken.compareToken(token);
  if (!matchedToken) return res.status(403).json({ error: "Invalid Token" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken.id);

  res.status(200).json({ message: "You Email Is Verified" });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid Request" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid Request" });

  EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken(6);

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.status(200).json({ message: "Check Your Mail" });
};

export const generateForgetPassWord: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(403).json({ error: "User not Found" });

  await passwordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}$userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check Your Registered Mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.status(200).json({ valid: true });
};

export const updatePassWord: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  console.log("i am here");

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid user" });

  const previousPassword = await user.comparePassword(password);

  if (previousPassword)
    return res
      .status(403)
      .json({ error: "Cannot Set Old Password, Please Create New Password" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPassWordResetMail(user.name, user.email);

  res.status(200).json({ message: "Password Reset Successfully" });
};
