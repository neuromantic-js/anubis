import { connect } from 'http2';
import Wingger from './wingger';
/* Main imports */
import configs from "../../configs/config";
import Logger from "./logger";
import SBI from "sbi";
import * as mongoose from 'mongoose';
import { IOrderModel } from '../models/order';
import { OrderSchema } from '../schemas/order';
import winston = require('winston');
import config from '../../configs/config';
/**
 * @class workWithMongoose
 */
export default class workWithMongo {
    private _connectionString: string;
    private _storage: SBI;
    private _mongooseLogger: winston.LoggerInstance;
    private _connection: mongoose.Connection;

    set connection(connection: mongoose.Connection) {
        this._connection = connection;
    }
    set storage(storage: SBI) {
        this._storage = storage;
    }
    set mongooseLogger(logger: winston.LoggerInstance) {
        this._mongooseLogger = logger;
    }
    set connectionString(connectionString: string) {
        this._connectionString = connectionString;
    }

    get storage(): SBI {
        return this._storage;
    }
    get connection(): mongoose.Connection {
        return this._connection;
    }
    get mongooseLogger(): winston.LoggerInstance {
        return this._mongooseLogger;
    }
    get connectionString(): string {
        return this._connectionString;
    }
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
        this.connectionString = (mongo.auth === false)
            ? `mongodb://${mongo.host}:${mongo.port}/${mongo.dbname}`
            : `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.dbname}`;
    }
    /**
     * Connect to database
     *
     * @class workWithMongo
     * @method connectToDatabase
     */
    private connectToDatabase(): any {
        this.connection = mongoose.createConnection(this.connectionString);
        
        this.storage.set({
            key: 'mongoConnection',
            value: this.connection
        });

        const model = this.storage.get('model').item();
        (<any>model).Order = this.connection.model<IOrderModel>('OrderModel', OrderSchema);

        this.mongooseLogger.info('Connected');
    }
    /**
     * Creates an instance of workWithMongo.
     * 
     * @memberOf workWithMongo
     */
    constructor() {
        this.storage = new SBI();
        
        const logger: Object = this.storage.get('logger').item();

        this.mongooseLogger = (<any>logger).addCategory('Mongoose', 'console', 'info', true, `${process.pid}/Mongoose`);
        this.mongooseLogger.info('Try mongoose connection');

        (<any>mongoose.Promise) = global.Promise;
        this.setMongoDbConnectionString();
        this.connectToDatabase();
    }
}
