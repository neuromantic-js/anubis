import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");
/* Configuration server constant */
import configs from "../configs/config";
/* Check mongo-express variable */
import mongoExpress = require("mongo-express/lib/middleware");
import mongoExpressConfig from "../configs/mongo-express-config";
/* Import routes */
import { BaronRoute } from "./routes/baron";
/* Imports fo ODM
 * interfaces */
/* Models */
import { IModel } from "./models/model";
/* Import main modules */
import workWithMongo from "./modules/workWithMongo";
/* Schemas */
/* import middlewares */
import JWTMiddleware from "./middlewares/jwt-decode";
/**
 * The server.
 *
 * @class Server
 */
export class Server {
    public app: express.Application;
    private model: IModel;
    private configs: Object
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        /* Instance default
         * initialize this to an empty object */
        this.model = Object();
        /* Set configs */
        this.configs = configs;
        /* Create expressjs application */
        this.app = express();
        /* Configure application */
        this.config();
        /* Add routes */
        this.routes();
        /* Add api */
        this.api();
    }
    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        //empty for now
    }
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        /* Add static path */
        this.app.use(express.static(path.join(__dirname, "public")));
        /* Configure PUG */
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");
        /* Use logger middleware */
        this.app.use(logger("dev"));
        /* Use JSON parser middleware */
        this.app.use(bodyParser.json());
        /* Use query string parser middlewares */
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        /* Use cookie parser middleware */
        this.app.use(cookieParser());
        /* Use override middleware */
        this.app.use(methodOverride());
        /* Add my custom middlewares */
        this.customMiddlewares();
        /* Check database main */
        if(configs.databases.main == "mongodb") {
            const mongooseConnection: workWithMongo = new workWithMongo();
        }
        /* Check run mongo-express */
        if(configs.mongoExpress.run) {
            this.app.use("/baron-admin", mongoExpress(mongoExpressConfig));
        }
        /* Catch 404 and forward to error handler */
        this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            error.status = 404;
            next(error);
        });
        /* Use error handling */
        this.app.use(errorHandler());
    }
    /**
     * Add custom middlewares
     *
     * @class Server
     * @method Custom middlewares
     */
    private customMiddlewares() {
        var jwtMiddleware =  new JWTMiddleware();
        this.app.use(jwtMiddleware.withoutDecode);
    }
    /**
     * Create router (with render).
     *
     * @class Server
     * @method config
     * @return void
     */
    private routes() {
        /* Set express router variable */
        let router: express.Router;
        router = express.Router();
        /* IndexRoute */
        BaronRoute.create(router);
        /* Use router middleware */
        this.app.use(router);
    }
}
