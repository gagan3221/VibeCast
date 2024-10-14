import { RequestHandler } from "express";

import { CreateUser } from "#/@Types/user";
import User from "#/models/user";
import nodemailer from "nodemailer";
import { Mailtrap_password, Mailtrap_user } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import emailVerificationToken from "#/models/emailVerificationToken";
import user from "#/models/user";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  /*const newUser = new User({email , password , name})
    newUser.save()*/
  const newUser = await User.create({ name, email, password });

  //Send verification
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: Mailtrap_user,
      pass: Mailtrap_password,
    },
  });
  //Two Methods
  //token = 6 digit otp => 123456 => send
  //token = attach these tokens to the <a href="yoururl/token=123456"> Verify</a>

  const token = generateToken(6);
   await emailVerificationToken.create({
    owner: newUser._id,
    token: token,
  });
  transport.sendMail({
    to: newUser.email,
    from: "auth@vibecast.in",
    html: `<h1>Your OTP is : ${token}</h1>`,
  });
  res.status(201).json({ newUser });
};
