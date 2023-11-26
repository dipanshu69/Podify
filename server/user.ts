import nodemailer from "nodemailer";
import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerification";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import emailVerification from "#/models/emailVerification";
import { generateToken } from "#/utils/helper";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  const token = generateToken(6);
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  transport.sendMail({
    to: user.email,
    from: "auth@myapp.com",
    html: `<h1>Your Verification Token Is ${token}</h1>`,
  });

  res.status(201).json({ user });
};
