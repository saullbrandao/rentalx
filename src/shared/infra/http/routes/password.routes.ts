import { Router } from "express";

import { ResetPasswordController } from "@modules/accounts/useCases/resetPassword/ResetPasswordController";
import { SendForgottenPasswordMailController } from "@modules/accounts/useCases/sendForgottenPasswordMail/SendForgottenPasswordMailController";

const passwordRoutes = Router();

const sendForgottenPasswordMailController =
  new SendForgottenPasswordMailController();

const resetPasswordController = new ResetPasswordController();

passwordRoutes.post("/forgotten", sendForgottenPasswordMailController.handle);
passwordRoutes.post("/reset", resetPasswordController.handle);

export { passwordRoutes };
