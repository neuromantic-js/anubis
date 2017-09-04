import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
/* Add reven */
import * as Raven from 'raven';
import methodOverride = require("method-override");
import mongoose = require("mongoose");
import errorHandler = require("errorhandler");
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
import logErrors from "./middlewares/logErrors";
import Crypt from "./modules/crypt";
import AccessControl from "./middlewares/accessControl";
import SentryService from "./modules/sentryService";
import CORS from "./middlewares/cors";
import Language from "./middlewares/language";
/**
 * The server.
 *
 * @class Server
 */
export class Server {
    public app: express.Application;
    private model: IModel;
    private configs: Object;
    private crypt: Crypt;
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
        this.crypt = new Crypt();
        /* Instance default
         * initialize this to an empty object */
        this.model = Object();
        this.crypt.setModel(this.model);
        /* Set configs */
        this.configs = configs;
        /* Create expressjs application */
        this.app = express();
        this.crypt.setApp(this.app);
        /* Configure application */
        this.config();
        /* Add routes */
        this.routes();
        /* Add middlewares with post data */
        this.postRequestMiddlewares();
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
        /* Connect to sentry by raven */
        const sentryService = new SentryService();
        sentryService.setCrypt(this.crypt);
        sentryService.connect();
        /* Add static path */
        this.app.use(express.static(path.join(__dirname, "public")));
        /* Configure PUG */
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");
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
            const mongooseConnection: workWithMongo = new workWithMongo(this.crypt);
        }
        /* Check run mongo-express */
        if(configs.mongoExpress.run) {
            this.app.use("/baron-admin", mongoExpress(mongoExpressConfig));
        }
    }
    /**
     * Add custom middlewares
     *
     * @class Server
     * @method Custom middlewares
     */
    private customMiddlewares() {
        /* Add access control middlewares (by JWT)*/
        const jwtMiddleware =  new JWTMiddleware(this.crypt);
        this.app.use(jwtMiddleware.withoutDecode.bind(jwtMiddleware));
        /* Add access coontrol middlewares (by cehck decoded) */
        const accessControl = new AccessControl();
        this.app.use(accessControl.checkAccess);
        /* Add language to request */
        const language = new Language();
        this.app.use(language.addLanguageToRequest);
        /* Add cors request */
        const cors = new CORS();
        const configCors = configs.cors;
        /* Set some options for CORS */
        cors.setOrigin(configCors.origin);
        cors.setHeaders(configCors.headers);
        cors.setMethods(configCors.methods);
        /* Add CORS middleware */
        this.app.use(cors.cors);
    }
    /**
     * Add middlewares before response
     */
    private postRequestMiddlewares() {
        /* Check config */
        if(configs.logger.errorHandler == "custom") {
            /* Add custom error handler */
            const LogErrors = new logErrors();
            this.app.use(LogErrors.onlyError);
        } else {
            /* Add standart error handler */
            this.app.use(errorHandler());
        }
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
