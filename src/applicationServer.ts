import Pagination from './middlewares/paginations';
import { load } from 'env2conf/lib/main';
import { appendFile } from 'fs';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import SBI from "sbi";
import methodOverride = require('method-override');
import errorHandler = require('errorhandler');
import ApplicationsConfig from "../configs/appConfig";
import ciConfig from "../configs/ciConfig";
import configs from "../configs/config";
import MongoExpressConfigAssembler from "../configs/mongoExpressConfig";
import mongoExpress = require('mongo-express/lib/middleware');
import { BaronRoute } from "./routes/baron";
import { LoginRoute} from "./routes/login";
import { OrdersRoute } from "./routes/orders";
import { IModel } from './models/model';
import workWithMongo from "./modules/workWithMongo";
import JWTMiddleware from "./middlewares/jwt-decode";
import logErrors from "./middlewares/logErrors";
import AccessControl from "./middlewares/accessControl";
import SentryService from "./modules/sentryService";
import CORS from "./middlewares/cors";
import Language from "./middlewares/language";
import config from '../configs/config';
import ApplicationConfig from '../configs/appConfig';
import Wingger from './modules/wingger';
import winston = require('winston');


export class Server {
    public _app: express.Application;
    private _model: IModel;
    private _configs: Object;
    private _storage: SBI;
    private _serverConfigs: ApplicationsConfig;
    private _serverLogger: winston.LoggerInstance;
    private _loggers: Object;

    set app(application: express.Application) {
      this._app = application;
    }
    set model(model: IModel) {
      this._model = model;
    }
    set configs(configs: Object) {
      this._configs = configs;
    }
    set serverConfigs(serverConfigs: ApplicationConfig) {
      this._serverConfigs = serverConfigs;
    }
    set storage(storage: SBI) {
      this._storage = storage;
    }
    set serverLogger(logger: winston.LoggerInstance) {
      this._serverLogger = logger;
    } 
    set loggers(loggers: Object) {
      this._loggers = loggers;
    }

    get app(): express.Application {
      return this._app;
    }
    get loggers(): Object {
      return this._loggers;
    }
    get model(): IModel {
      return this._model;
    }
    get configs(): Object {
      return this._configs;
    }
    get serverConfigs(): ApplicationConfig {
      return this._serverConfigs;
    }
    get storage(): SBI {
      return this._storage;
    }
    get serverLogger(): winston.LoggerInstance {
        return this._serverLogger;
    }

    public static bootstrap(): Server {
        return new Server();
    }


    constructor() {

      this.serverConfigs = new ApplicationsConfig();
      this.serverConfigs.setCiConfig(ciConfig);

      const wingger = new Wingger('syslogs');

      this.storage = new SBI();
      this.storage.set({
        key: 'logger',
        value: wingger
      });

      this.loggers = this.storage.get('logger').item();

      this.serverLogger = (<any>this.loggers).addCategory('AnubisServer', 'console', 'info', true, `${process.pid}/Server`);

      this.serverLogger.info('Starting Anubis server!');

      this.storage.set({
        key: 'configs',
        value: this.serverConfigs
      });

      this.model = Object();
      this.storage.set({
        key: 'model',
        value: this.model
      });

      this.configs = configs;

      this.app = express();
      this.storage.set({
        key: 'application',
        value: this.app
      });

      this.config();
      this.routes();
      this.postRequestMiddlewares();
      this.api();
    }


    public api() {}


    public config() {

      const allSettings = (<any>this.serverConfigs.getMe()).app;
      const upstartModules = allSettings.modules;
      const appSettings = allSettings.settings;


      if(upstartModules.sentry == true) {

        const sentryService = new SentryService();

        this.storage.set({
          "key": "sentry",
          "value": sentryService
        });
        sentryService.connect();
      }

      if(upstartModules.staticFolder == true){
        this.app.use(express.static(path.join(__dirname, 'public')));
      }

      if(upstartModules.templates == true) {
        this.app.set('views', path.join(__dirname, appSettings.templates.dir));
        this.app.set('view engine', appSettings.templates.engine);
      }

      if(upstartModules.jsonParser == true) {
        this.app.use(bodyParser.json());
      }

      if(upstartModules.queryParser == true) {
        this.app.use(bodyParser.urlencoded({
          extended: true
        }));
      }

      if(upstartModules.cookieParser == true) {
        this.app.use(cookieParser());
      }

      if(upstartModules.methodOverride == true) {
        this.app.use(methodOverride());
      }

      this.customMiddlewares();

      if(appSettings.mainDB == 'mongodb') {
        const mongooseConnection: workWithMongo = new workWithMongo();
      }

      if(upstartModules.mongoExpress == true) {
        
        const mongoExpressConfigAssembler = new MongoExpressConfigAssembler();
        const MEConfigs = mongoExpressConfigAssembler.getMEConfig();
        
        
        this.app.use('/anubis-admin', mongoExpress(MEConfigs));
      }
    }


    private customMiddlewares() {

      const jwtMiddleware =  new JWTMiddleware();

      this.app.use(jwtMiddleware.withoutDecode.bind(jwtMiddleware));

      const accessControl = new AccessControl();

      this.app.use(accessControl.checkAccess);

      const language = new Language();
      
      this.app.use(language.addLanguageToRequest);
      
      const cors = new CORS();
      const configCors = configs.cors;
      
      cors.setOrigin(configCors.origin);
      cors.setHeaders(configCors.headers);
      cors.setMethods(configCors.methods);
      
      this.app.use(cors.cors.bind(cors));

      const pagination = new Pagination();
      this.app.use(pagination.init);
    }


    private postRequestMiddlewares() {

      if(configs.logger.errorHandler == 'custom') {

        const LogErrors = new logErrors();
        this.app.use(LogErrors.onlyError);
      
      } else {  
        this.app.use(errorHandler());
      }
    }


    private routes() {
    
      let router: express.Router;
      router = express.Router();
      
      BaronRoute.create(router);
      LoginRoute.create(router);
      OrdersRoute.create(router);
      
      this.app.use(router);
    }
}
