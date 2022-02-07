import "reflect-metadata";
import { container } from "tsyringe";

beforeAll(() => {
  container.clearInstances();
});
