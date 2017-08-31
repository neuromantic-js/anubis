import { Schema } from "mongoose";

export var microserviceSchema: Schema = new Schema({
    name: String,
    documentation: String,
    gitlab: String,
    requements: String,
    description: String,
    version: String,
    date: Date,
    dependencies: String,
    owner: String
});
microserviceSchema.pre("save", function(next) {
    if(!this.date) {
        this.date = new Date();
    }
    next();
});
