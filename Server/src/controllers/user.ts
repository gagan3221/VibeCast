import { RequestHandler } from "express";

import { CreateUser } from "#/@Types/user";
import User from "#/models/user";
import nodemailer from "nodemailer";
import { Mailtrap_password, Mailtrap_user } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import emailVerificationToken from "#/models/emailVerificationToken";
import user from "#/models/user";
import { mailTemplate } from "#/mail/template";
import path from "path";

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
    html: mailTemplate({
      headTitle: "VibeCast",
      token: token,
      contentDescription: "Verify your email",
      mainDescription: "Here is your Email Verification OTP",
      background_image : "cid:background_2",
      facebook : "cid:facebook" ,
      instagram : "cid:instagram" ,
      twitter : "cid:twitter" ,
      header_image : "cid:header_image" ,
      beefree : "cid:beefree"
    }),
    attachments: [
      {
        filename: "background_2.png",
        path: path.join(__dirname, "../mail/images/background_2.png"),
        cid : "background_2"
      },
      {
        filename: "facebook2x.png",
        path: path.join(__dirname, "../mail/images/facebook2x.png"),
        cid : "facebook"
      },
      {
        filename: "instagram2x.png",
        path: path.join(__dirname, "../mail/images/instagram2x.png"),
        cid : "instagram"
      },
      {
        filename: "twitter2x.png",
        path: path.join(__dirname, "../mail/images/twitter2x.png"),
        cid : "twitter"
      },
      {
        filename: "header3.png",
        path: path.join(__dirname, "../mail/images/header3.png"),
        cid : "header_image"
      },
      {
        filename : "Beefree-logo.png",
        path : path.join(__dirname , "../mail/images/Beefree-logo.png") ,
        cid : "beefree"
      }
    ],
  });
  res.status(201).json({ newUser });
};
