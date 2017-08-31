import { Model } from "mongoose";
import { IMicroserviceModel } from "./microservice";

export interface IModel {
    microservice: Model<IMicroserviceModel>;
}
