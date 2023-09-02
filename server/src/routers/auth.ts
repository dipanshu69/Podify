import { create } from "#/controllers/user";
import { validate } from "#/middleware/validators";
import { CreateUserSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

export default router;
