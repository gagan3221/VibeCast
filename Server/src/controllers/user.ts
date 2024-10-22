import { RequestHandler } from "express";

import { CreateUser, VerifyEmailAddress } from "#/@Types/user";
import User from "#/models/user";
import { sendForgetPasswordLink, sendVerificationMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";
import emailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import passwordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { reset_password_link } from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  /*const newUser = new User({email , password , name})
    newUser.save()*/
  const newUser = await User.create({ name, email, password });

  //Send verification email
  const token = generateToken(6);
  await emailVerificationToken.create({
    owner: newUser._id,
    token: token,
  });
  sendVerificationMail(token, { email, userId: newUser._id.toString() });

  res.status(201).json({ newUser: { name, email, id: newUser._id } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailAddress,
  res
) => {
  try {
    const { token, userId } = req.body;

    const verificationToken = await emailVerificationToken.findOne({
      owner: userId,
    });

    if (!verificationToken) {
      return res.status(403).json({ error: "Invalid token!" });
    }

    const matched = verificationToken.compareToken(token);

    if (!matched) {
      return res.status(403).json({ error: "Invalid token!" });
    }

    // Mark the user as verified
    await User.findByIdAndUpdate(userId, { verified: true });

    // Remove the token after successful verification
    await emailVerificationToken.findByIdAndDelete(verificationToken._id);

    res.json({ message: "Email registered successfully" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid Request!!" });
  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid Request!!" });
  await emailVerificationToken.findOneAndDelete({
    owner: userId,
  });
  const token = generateToken(6);
  await emailVerificationToken.create({
    owner: userId,
    token: token,
  });

  sendVerificationMail(token, {
    email: user?.email,
    userId: user?._id.toString(),
    name: user?.name,
  });
  res.json({ message: "Please Check your mail!!" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found" });
  // generate the link
  //https://yourapp.com/auth/reset-password?token=hkajshs&userId=143264
  const token = crypto.randomBytes(36).toString("hex");
  await passwordResetToken.findOneAndDelete({
    owner : user._id
  })
  await passwordResetToken.create({
    owner: user._id,
    token: token,
  });

  const resetLink = `${reset_password_link}?token=${token}&userId=${user._id}`;
  sendForgetPasswordLink({ email: user.email, link: resetLink });
  res.json({
    message: "Check your registered email",
  });
};
