import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in_memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in_memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgottenPasswordMailUseCase } from "./SendForgottenPasswordMailUseCase";

let usersRepository: UsersRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let sendForgottenPasswordMailUseCase: SendForgottenPasswordMailUseCase;
let mailProvider: MailProviderInMemory;
let dateProvider: DayjsDateProvider;

describe("Send Forgotten Password Mail", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgottenPasswordMailUseCase = new SendForgottenPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send email to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepository.create({
      driver_license: "123456789",
      email: "john_doe@example.com",
      password: "1234",
      name: "John Doe",
    });

    await sendForgottenPasswordMailUseCase.execute("john_doe@example.com");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send an email if the user does not exists", async () => {
    await expect(
      sendForgottenPasswordMailUseCase.execute("invalid@user.com")
    ).rejects.toEqual(new AppError("User does not exists"));
  });
});
