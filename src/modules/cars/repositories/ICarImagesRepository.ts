import { CarImage } from "../infra/typeorm/entities/CarImage";

export interface ICreateCarImageDTO {
  car_id: string;
  image_name: string;
}

interface ICarImagesRepository {
  create({ car_id, image_name }: ICreateCarImageDTO): Promise<CarImage>;
}

export { ICarImagesRepository };
