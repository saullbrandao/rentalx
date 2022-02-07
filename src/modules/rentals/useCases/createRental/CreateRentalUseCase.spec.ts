import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepository: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const datePlus24Hours = dayjs().add(24, "hours").toDate();

  beforeEach(() => {
    rentalsRepository = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      dateProvider,
      carsRepository
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepository.create({
      name: "Test",
      description: "Test",
      daily_rate: 100,
      brand: "Test",
      fine_amount: 10,
      category_id: "1",
      license_plate: "AAA-1111",
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "123",
      expected_return_date: datePlus24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    await rentalsRepository.create({
      car_id: "1111",
      user_id: "123",
      expected_return_date: datePlus24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: "1234",
        user_id: "123",
        expected_return_date: datePlus24Hours,
      })
    ).rejects.toEqual(new AppError("User already has a rental"));
  });

  it("should not be able to create a new rental if the car is unavailable", async () => {
    await rentalsRepository.create({
      car_id: "123",
      user_id: "123",
      expected_return_date: datePlus24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: "123",
        user_id: "1234",
        expected_return_date: datePlus24Hours,
      })
    ).rejects.toEqual(new AppError("Car already rented"));
  });

  it("should not be able to create a new rental if expected return date is less than 24 hours from the rental start date", async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: "123",
        user_id: "123",
        expected_return_date: new Date(),
      })
    ).rejects.toEqual(
      new AppError(
        "Expected return date must be at least 24 hours after the current date"
      )
    );
  });
});
