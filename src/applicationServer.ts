import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as path from "path";
import SBI from "sbi";
import methodOverride = require("method-override");
import errorHandler = require("errorhandler");
/* Configuration servet */
import ApplicationsConfig from "../configs/appConfig";
import ciConfig from "../configs/ciConfig";
import configs from "../configs/config";
/* Check mongo-express variable */
import MongoExpressConfigAssembler from "../configs/mongoExpressConfig";
import mongoExpress = require("mongo-express/lib/middleware");
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
    private storage: SBI;
    private serverConfigs: ApplicationsConfig;
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
      /* Create object with server settings */
      this.serverConfigs = new ApplicationsConfig();
      this.serverConfigs.setCiConfig(ciConfig);
      /* Connect to applications storage */
      this.storage = new SBI();
      /* Add all configs in box */
      this.storage.set({
        "key": "configs",
        "value": this.serverConfigs
      });
      /* Instance default
       * initialize this to an empty object */
      this.model = Object();
      this.storage.set({
        "key": "model",
        "value": this.model
      });
      /* Set configs */
      this.configs = configs;
      /* Create Express application */
      this.app = express();
      this.storage.set({
        "key": "application",
        "value": this.app
      });
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
      /* Get applications settings from store */
      const allSettings = (<any>this.serverConfigs.getMe()).app;
      const upstartModules = allSettings.modules;
      const appSettings = allSettings.settings;
      /* Check sentry */
      if(upstartModules.sentry == true) {
        /* Connect to sentry by raven */
        const sentryService = new SentryService();
        this.storage.set({
          "key": "sentry",
          "value": sentryService
        });
        sentryService.connect();
      }
      /* Check static folder */
      if(upstartModules.staticFolder == true){
        /* Add static path */
        this.app.use(express.static(path.join(__dirname, "public")));
      }
      /* Check tamplate engine */
      if(upstartModules.templates == true) {
        /* Configure PUG */
        this.app.set("views", path.join(__dirname, appSettings.templates.dir));
        this.app.set("view engine", appSettings.templates.engine);
      }
      /* Check json parser middlewares */
      if(upstartModules.jsonParser == true) {
        /* Use JSON parser middleware */
        this.app.use(bodyParser.json());
      }
      /* Check query parser */
      if(upstartModules.queryParser == true) {
        /* Use query string parser middlewares */
        this.app.use(bodyParser.urlencoded({
          extended: true
        }));
      }
      /* Check cookie */
      if(upstartModules.cookieParser == true) {
        /* Use cookie parser middleware */
        this.app.use(cookieParser());
      }
      /* Check method override */
      if(upstartModules.methodOverride == true) {
        /* Use override middleware */
        this.app.use(methodOverride());
      }
      /* Add my custom middlewares */
      this.customMiddlewares();
      /* Check database main */
      if(appSettings.mainDB == "mongodb") {
        const mongooseConnection: workWithMongo = new workWithMongo();
      }
      /* Check run mongo-express */
      if(upstartModules.mongoExpress == true) {
        const mongoExpressConfigAssembler = new MongoExpressConfigAssembler();
        const MEConfigs = mongoExpressConfigAssembler.getMEConfig();
        this.app.use("/baron-admin", mongoExpress(MEConfigs));
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
        const jwtMiddleware =  new JWTMiddleware();
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
        console.log(configCors);
        cors.setOrigin(configCors.origin);
        cors.setHeaders(configCors.headers);
        cors.setMethods(configCors.methods);
        /* Add CORS middleware */
        this.app.use(cors.cors.bind(cors));
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
