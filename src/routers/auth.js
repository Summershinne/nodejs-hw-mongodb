import { Router } from "express";
import validateBody from "../utils/validateBoody.js";
import { requestResetEmailSchema, userSinginSchema, userSingupSchema } from "../validation/user.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginController, logoutController, refreshController, registerController, requestResetEmailController } from "../controllers/auth-controler.js";

const authRouter = Router();

authRouter.post('/register', validateBody(userSingupSchema), ctrlWrapper(registerController));

authRouter.post('/login', validateBody(userSinginSchema), ctrlWrapper(loginController));

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController))

export default authRouter;