import { Router } from "express";


import { CreateUserSchema, emailVerificationBody } from "#/utils/ValidationSchema";
import { validate } from "#/Middleware/validator";
import { create, sendReVerificationToken, verifyEmail } from "#/controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email" ,validate(emailVerificationBody),verifyEmail);
router.post("/re-verify-email" , sendReVerificationToken);
export default router;
