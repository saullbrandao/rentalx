import { Request, Response } from "express";
import { container } from "tsyringe";

import { UserProfileUseCase } from "./UserProfileUseCase";

class UserProfileController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userProfileUseCase = container.resolve(UserProfileUseCase);

    const user = await userProfileUseCase.execute(req.user.id);

    return res.json(user);
  }
}

export { UserProfileController };
