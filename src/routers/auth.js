import { Router } from "express";
import validateBody from "../utils/validateBoody.js";
import { userSinginSchema, userSingupSchema } from "../validation/user.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginController, registerController } from "../controllers/auth-controler.js";

const authRouter = Router();

authRouter.post('/register', validateBody(userSingupSchema), ctrlWrapper(registerController));

authRouter.post('/login', validateBody(userSinginSchema), ctrlWrapper(loginController));

export default authRouter;