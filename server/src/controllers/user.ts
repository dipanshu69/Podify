import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMain } from "#/utils/mail";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const token = generateToken(6);
  const user = await User.create({ name, email, password });
  sendVerificationMain(token, { name, email, userId: user._id.toString() });

  res.status(201).json({
    user: {
      id: user._id,
      name,
      email,
    },
  });
};
