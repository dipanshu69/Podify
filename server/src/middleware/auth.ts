import passwordResetToken from "#/models/passwordResetToken";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "#/models/user";

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

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized Request" });

  const payLoad = verify(token, JWT_SECRET) as JwtPayload;
  const id = payLoad.userId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) return res.status(403).json({ error: "Unauthorized Request" });

  (req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  }),
    next();
};
