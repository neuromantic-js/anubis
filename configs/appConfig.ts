const config: Object =  {
  "modules": {
    "jwt": true,
    "sentry": false,
    "logger": true,
    "mongoExpress": true,
    "cors": true,
    "staticFolder": true,
    "templates": true,
    "jsonParser": true,
    "queryParser": true,
    "cookieParser": true,
    "methodOverride": true
  },
  "settings": {
    "mainDB": "mongodb",
    "cache": "redis",
    "server": {
      "host": "localhost",
      "port": 8080
    },
    "sentry": {
      "levels": ["WARN", "ERROR"]
    },
    "cors": {
      "origin": "*",
      "headers": "referrer, x-access-token, Origin, X-Requested-With, Content-Type, Accept, x-language, X-CSRFToken",
      "methods": "GET, POST, HEAD, PUT, DELETE, OPTIONS"
    },
    "logger": {
      "errorHandler": "custom",
      "level": "errors",
      "type": "json",
      "console": true
    },
    "templates": {
      "engine": "pug",
      "dir": "view"
    },
    "mongoExpress": {
      "autoReconnect": true,
      "poolSize": 4,
      "enableAdmin": true,
      "login": "",
      "password": "",
      "baseUrl": "/",
      "cookieKeyName": "mongo-express",
      "cookieSecret": "cookiesecret",
      "requestSizeLimit": "50mb",
      "sessionSecret": "sessionsecret",
      "sslKey": "",
      "sslEnabled": false,
      "sslCert": "",
      "useBasicAuth": true,
      "basicAuthLogin": "baron",
      "basicAuthPassword": "samedi",
      "documentPerPage": 10,
      "editorTheme": "rubyblue",
      "maxPropSize": (100 * 1000),
      "maxRowSize": (1000 * 1000),
      "cmdType": "eval",
      "subprocessTimeout": 300,
      "readOnly": false,
      "defaultKeyNames": {},
      "url": process.env.MONGO_URL || "mongodb://localhost:27017/baron-samedi"
    }
  }
};
/**
 * Object for buid app config
 *
 * @class ApplicationConfig
 */
export default class ApplicationConfig {
  private mainConfig: Object;
  private mongoExpressConfig: Object;
  private ciConfig: Object;

  /**
   * @constructor
   */
  constructor() {
    this.mainConfig = config;
  }

  /**
   * Return all settings
   *
   * @method getMe
   * @memberOf ApplicationConfig
   * @return {Object}
   */
  public getMe(): Object {
    /* Assemble full config */
    const objectToReturn: Object = {
      "app": this.mainConfig,
      "ci": this.ciConfig,
      "adminPanel": this.mongoExpressConfig
    };
    /* Return full config */
    return objectToReturn;
  }

  /**
   * Set configs from CI (exported from env2conf)
   *
   * @method setCiConfig
   * @param {Object} value
   * @memberOf ApplicationConfig
   * @return {void}
   */
  public setCiConfig(value: Object): void {
    this.ciConfig = value;
  }
}
