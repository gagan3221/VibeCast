import { RequestHandler } from "express";

import { CreateUser, VerifyEmailAddress } from "#/@Types/user";
import User from "#/models/user";
import { sendVerificationMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";
import emailVerificationToken from "#/models/emailVerificationToken";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  /*const newUser = new User({email , password , name})
    newUser.save()*/
  const newUser = await User.create({ name, email, password });

  //Send verification email
  const token = generateToken(6);
  sendVerificationMail(token, { email, userId: newUser._id.toString() });

  res.status(201).json({ newUser: { name, email, id: newUser._id } });
};

export const verifyEmail: RequestHandler = async (req: VerifyEmailAddress, res) => {
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
    console.error('Error during email verification:', error);
    res.status(500).json({ error: "Server error" });
  }
};
