import { RequestHandler } from "express";

import { CreateUser } from "#/@Types/user";
import User from "#/models/user";


export const create : RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  /*const newUser = new User({email , password , name})
    newUser.save()*/
  const newUser = await User.create({ name, email, password });
  res.status(201).json({ newUser });
}