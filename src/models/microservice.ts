import { Document } from "mongoose";
import { IMicroservice } from "../interfaces/microservice";

export interface IMicroserviceModel extends IMicroservice, Document {
    /* Custom methods for you model would be define here */
}
