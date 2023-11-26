import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { RequestHandler } from "express";
import User from "#/models/user";
import { formatProfile, generateToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendPassWordResetMail,
  sendVerificationMail,
} from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerification";
import PasswordResetToken from "#/models/passwordResetToken";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import passwordResetToken from "#/models/passwordResetToken";
import jwt from "jsonwebtoken";
import { RequestWithFiles } from "#/middleware/fileParser";
import cloudinary from "#/cloud";
import formidable from "formidable";

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

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({
    email: email,
  });

  if (!user) return res.status(403).json({ error: "Email/Password Mismatch" });

  const matchPassWord = await user.comparePassword(password);

  if (!matchPassWord) return res.status(403).json({ error: "Wrong Password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  user.tokens.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  console.log(name);

  const files = req.files?.avatar as formidable.File[];
  const avatar = files[0];

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something Went Wrong");

  if (typeof name[0] !== "string")
    return res.status(422).json({ error: "Invalid Name Format!" });

  if (name[0].trim().length < 3)
    return res.status(422).json({ error: "Invalid Name!" });

  user.name = name[0];

  if (avatar) {
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
  }

  await user.save();

  res.json({ profile: formatProfile(user) });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.status(200).json({ profile: req.user });
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something Went Wrong, User Not Found");

  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((item) => item !== token);

  await user.save();
  res.status(200).json({ success: true });
};
