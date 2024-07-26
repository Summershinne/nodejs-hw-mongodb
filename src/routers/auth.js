import { Router } from "express";
import validateBody from "../utils/validateBody.js";
import { requestResetEmailSchema, resetPasswordSchema, userSinginSchema, userSingupSchema } from "../validation/user.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginController, logoutController, refreshController, registerController, requestResetEmailController, resetPasswordController } from "../controllers/auth-controler.js";

const authRouter = Router();

authRouter.post('/register', validateBody(userSingupSchema), ctrlWrapper(registerController));

authRouter.post('/login', validateBody(userSinginSchema), ctrlWrapper(loginController));

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default authRouter;