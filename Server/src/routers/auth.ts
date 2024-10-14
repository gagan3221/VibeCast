import { Router } from "express";


import { CreateUserSchema } from "#/utils/ValidationSchema";
import { validate } from "#/Middleware/validator";
import { create } from "#/controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

export default router;
