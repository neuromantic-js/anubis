/* Main imports */
import mongoose = require("mongoose");
import configs from "../../configs/config";
import Logger from "./logger";
import SBI from "sbi";
/**
 * @class workWithMongoose
 */
export default class workWithMongo {
    private mongoDbConnectionString: string;
    private connection: mongoose.Connection;
    private logger: Logger;
    private storage;
    /**
     * Set connection string to MongoDB.
     * Get data from configs.
     *
     * @class workWithMongo
     * @method setMongoDbConnectionString
     */
    private setMongoDbConnectionString(): void {
        /* Set constant */
        const mongo = configs.databases.mongodb;
        /* Set private var */
        this.mongoDbConnectionString = (mongo.auth === false)
            ? `mongodb://${mongo.host}:${mongo.port}/${mongo.dbname}`
            : `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.dbname}`;
    }
    /**
     * Get connection string to MongoDB
     *
     * @class workWithMongo
     * @method getMongoDbConnectionString
     */
    public getMongoDbConnectionString(): string {
        return this.mongoDbConnectionString;
    }
    /**
     * Get all this object
     *
     * @class workWithMongo
     * @method getMe
     */
    public getMe(): workWithMongo {
        return this;
    }
    /**
     * Connect to database
     *
     * @class workWithMongo
     * @method connectToDatabase
     */
    private connectToDatabase(): any {
        this.connection = mongoose.createConnection(this.mongoDbConnectionString, (error, result) => {
            /* Check error */
            if(error != undefined) {
                this.logger.console("error", `Can not connected to MongoDB with error: ${JSON.stringify(error)}`);
            } else {
                /* Log in console */
                this.storage.set({
                  "key": "mongoConnection",
                  "value": this.connection
                });
                this.logger.console("info", "MongoDB is connected!");
            }
        });
    }
    /**
     * Set loggeR
     * 
     * @private
     * 
     * @memberOf workWithMongo
     */
    private setLogger(): void {
        /* Set logger options */
        const options: Object = {
            "path": "mongoose.connection"
        };
        this.logger = new Logger(options);
    }
    /**
     * Creates an instance of workWithMongo.
     * 
     * @memberOf workWithMongo
     */
    constructor() {
        this.storage = new SBI();
        this.setLogger();
        mongoose.Promise = global.Promise;
        this.setMongoDbConnectionString();
        this.connectToDatabase();
    }
}
