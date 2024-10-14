import { CreateUser } from "#/@Types/user";
import User from "#/models/user";
import { error } from "console";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  (req: CreateUser, res, next) => {
    const { name, email, password } = req.body;
    //Validate Name
    if (!name.trim()) {
      return res.json({ error: "Name is missing" });
    }
    if(name.length < 3){
        return res.json({error : 'Invalid name'});
    }
    //Validate Password
    if (!password || password.length < 6) {
    return res.json({ error: 'Password must be at least 6 characters long' });
     }
    //Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
    return res.json({ error: 'Invalid email' });
  }
    next();
  },
  async (req: CreateUser, res) => {
    const { name, email, password } = req.body;
    /*const newUser = new User({email , password , name})
    newUser.save()*/
    const newUser = await User.create({ name, email, password });
    res.json({ newUser });
  }
);

export default router;
