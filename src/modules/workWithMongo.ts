/* Main imports */
import mongoose = require("mongoose");
import configs from "../../configs/config";
/**
 * @class workWithMongoose
 */
export default class workWithMongo {
    private mongoDbConnectionString: string;
    private connection: mongoose.Connection;
    /**
     * Set connection string to MongoDB.
     * Get data from configs.
     *
     * @class workWithMongo
     * @method setMongoDbConnectionString
     */
    private setMongoDbConnectionString():void {
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
    public getMongoDbConnectionString():string {
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
    private connectToDatabase():any {
        this.connection = mongoose.createConnection(this.mongoDbConnectionString, (error, result) => {
            // Add logger
            console.log("MongoDB has connected");
        });
    }
    /**
     * Constructor
     * @class workWithMongo
     * @constructor
     */
    constructor() {
        mongoose.Promise = global.Promise;
        this.setMongoDbConnectionString();
        this.connectToDatabase();
    }
}
