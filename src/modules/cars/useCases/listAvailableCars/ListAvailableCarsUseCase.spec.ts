import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepository.create({
      name: "Car 1",
      description: "Car description",
      brand: "Car brand",
      category_id: "70b583b5-5c8d-442b-bb0e-4b69700641bc",
      license_plate: "ABC-1111",
      fine_amount: 100,
      daily_rate: 100,
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepository.create({
      name: "Car 2",
      description: "Car description",
      brand: "Car_brand",
      category_id: "70b583b5-5c8d-442b-bb0e-4b69700641bc",
      license_plate: "ABC-2222",
      fine_amount: 100,
      daily_rate: 100,
    });

    const cars = await listAvailableCarsUseCase.execute({ brand: "Car_brand" });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepository.create({
      name: "Car 3",
      description: "Car description",
      brand: "Car_brand",
      category_id: "70b583b5-5c8d-442b-bb0e-4b69700641bc",
      license_plate: "ABC-3333",
      fine_amount: 100,
      daily_rate: 100,
    });

    const cars = await listAvailableCarsUseCase.execute({ name: "Car 3" });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category_id", async () => {
    const car = await carsRepository.create({
      name: "Car 4",
      description: "Car description",
      brand: "Car_brand",
      category_id: "70b583b5-5c8d-442b-bb0e-4b69700641bc",
      license_plate: "ABC-4444",
      fine_amount: 100,
      daily_rate: 100,
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "70b583b5-5c8d-442b-bb0e-4b69700641bc",
    });

    expect(cars).toEqual([car]);
  });
});
