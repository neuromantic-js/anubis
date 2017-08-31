import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");
/* Import routes */
import { IndexRoute } from "./routes/index";
import { BaronRoute } from "./routes/baron";
import { LoginRoute } from "./routes/login";
import { MicroservicesList } from "./routes/microservices";
import { CreateEntryRouter } from "./routes/create-entry";
import { ViewCardRouter } from "./routes/view-card";
import { LogoutRoute } from "./routes/logout";
/* Imports fo ODB
 * interfaces */
import { IMicroservice } from "./interfaces/microservice";
/* Models */
import { IModel } from "./models/model";
import { IMicroserviceModel } from "./models/microservice";
/* Schemas */
import { microserviceSchema } from "./schemas/microservice";
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
        /* MongoDB default path */
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/maman-brigitte"
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
        /* Use q promises */
        //global.Promise = require("q").Promise
        mongoose.Promise = global.Promise;
        /* Connection to mongoose */
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        /* Create models */
        this.model.microservice = connection.model<IMicroserviceModel>("Microservice", microserviceSchema);
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
     * Create router.
     *
     * @class Server
     * @method config
     * @return void
     */
    private routes() {
        let router: express.Router;
        router = express.Router();
        console.log(this.model.microservice);
        /* IndexRoute */
        IndexRoute.create(router);
        BaronRoute.create(router);
        LoginRoute.create(router);
        MicroservicesList.create(router, this.model);
        ViewCardRouter.create(router, this.model);
        CreateEntryRouter.create(router, this.model);
        LogoutRoute.create(router);
        /* Use router middleware */
        this.app.use(router);
    }
}
