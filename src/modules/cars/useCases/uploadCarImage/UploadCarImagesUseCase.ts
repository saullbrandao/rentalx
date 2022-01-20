import { inject, injectable } from "tsyringe";

import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";
import { ICarImagesRepository } from "@modules/cars/repositories/ICarImagesRepository";

interface IRequest {
  car_id: string;
  images_names: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarImagesRepository")
    private carImagesRepository: ICarImagesRepository
  ) {}

  async execute({ car_id, images_names }: IRequest): Promise<CarImage[]> {
    const images = await Promise.all(
      images_names.map(async (image_name) => {
        const image = await this.carImagesRepository.create({
          car_id,
          image_name,
        });

        return image;
      })
    );

    return images;
  }
}

export { UploadCarImagesUseCase };
