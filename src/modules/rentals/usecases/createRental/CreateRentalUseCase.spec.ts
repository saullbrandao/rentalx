import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepository: RentalsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const datePlus24Hours = dayjs().add(24, "hours").toDate();

  beforeEach(() => {
    rentalsRepository = new RentalsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      dateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      car_id: "123",
      user_id: "123",
      expected_return_date: datePlus24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if the car is unavailable", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "123",
        user_id: "123",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        car_id: "123",
        user_id: "1234",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if there is another open to the same user", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "123",
        user_id: "123",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        car_id: "1234",
        user_id: "123",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if expected return date is less than 24 hours from the rental start date", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "123",
        user_id: "123",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
