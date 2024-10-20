import { RequestHandler } from "express";

import { CreateUser } from "#/@Types/user";
import User from "#/models/user";
import { sendVerificationMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  /*const newUser = new User({email , password , name})
    newUser.save()*/
  const newUser = await User.create({ name, email, password });

  //Send verification email
  const token = generateToken(6);
  sendVerificationMail(token , { email, userId: newUser._id.toString() });

  res.status(201).json({ newUser : {name , email , id: newUser._id} });
};
