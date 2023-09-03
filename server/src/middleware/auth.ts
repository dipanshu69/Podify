import passwordResetToken from "#/models/passwordResetToken";
import { RequestHandler } from "express";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;
  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthorized Access. Invalid Token" });

  const matchToken = await resetToken.compareToken(token);
  if (!matchToken) return res.status(403).json({ error: "Invalid Token" });

  next();
};
