import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarsSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarsSpecificationUseCase: CreateCarsSpecificationUseCase;
let carsRepository: CarsRepositoryInMemory;
let specificationsRepository: SpecificationsRepositoryInMemory;

describe("Create car specification", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    specificationsRepository = new SpecificationsRepositoryInMemory();
    createCarsSpecificationUseCase = new CreateCarsSpecificationUseCase(
      carsRepository,
      specificationsRepository
    );
  });

  it("should not be able to add a new specification to a non-existent car", async () => {
    const car_id = "1234";
    const specifications_id = ["54321"];

    await expect(
      createCarsSpecificationUseCase.execute({
        car_id,
        specifications_id,
      })
    ).rejects.toEqual(new AppError("Car not found"));
  });

  it("should be able to add a new specification to a car", async () => {
    const car = await carsRepository.create({
      name: "Name car",
      description: "Description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const spec = await specificationsRepository.create({
      name: "Name spec",
      description: "Description spec",
    });

    const specifications_id = [spec.id];

    const carSpecifications = await createCarsSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(carSpecifications).toHaveProperty("specifications");
    expect(carSpecifications.specifications.length).toBe(1);
  });
});
