import configs from "./config";
import SBI from "sbi";
const mongo = configs.databases.mongodb;
const mongoExpress = configs.mongoExpress;
const server = configs.server;

export default class MongoExpressConfigAssembler {
    private configs: Object;
    private meConfig: Object;
    private storage: SBI;

    constructor() {
        this.storage = new SBI();
        this.setMEConfig();
    }

    private setMEConfig(): void {
        this.configs = this.storage.get("configs").item();
    }

    public getMEConfig(): Object {
        const allSettings = (<any>this.configs).getMe();
        const mSettings = allSettings.ci.mongo;
        const meSettings = allSettings.app.settings.mongoExpress;
        const objectToReturn:Object = {
          "mongodb":{
              "connectionString": (mSettings.auth == false)
                ? `mongodb://${mSettings.host}:${mSettings.port}/${mSettings.dbname}`
                : `mongodb://${mSettings.user}:${mSettings.password}@${mSettings.host}:${mSettings.port}/${mSettings.dbname}`,
            "server": mSettings.host,
            "port": mSettings.port,
            "autoReconnect": meSettings.autoReconnect,
            "poolSize": meSettings.poolSize,
            "admin": meSettings.enableAdmin,
            "auth": [{
                "database": mSettings.dbname,
                "username": mSettings.user,
                "password": mSettings.password
            }],
            "adminUser": meSettings.login,
            "adminPassword": meSettings.password,
            "whitelist": [],
            "blacklist": [],
          },
          "site": {
            "baseUrl": meSettings.baseUrl,
            "cookieKeyName": meSettings.cookieKeyName,
            "cookieSecret": meSettings.cookieSecret,
            "host": allSettings.app.settings.server.host,
            "port": allSettings.app.settings.server.port,
            "requestSizeLimit": meSettings.requestSizeLimit,
            "sessionSecret": meSettings.sessionSecret,
            "sslKey": meSettings.sslKey,
            "sslEnabled": meSettings.sslEnabled,
            "sslCert": meSettings.sslCert,
          },
          "useBasicAuth": meSettings.useBasicAuth,
          "basicAuth": {
            "username": meSettings.basicAuthLogin,
            "password": meSettings.basicAuthPassword
          },
          "options": {
            "documentPerPage": meSettings.documentPerPage,
            "editorTheme": meSettings.editorTheme,
            "maxPropSize": meSettings.maxPropSize,
            "maxRowSize": meSettings.maxRowSize,
            "cmdType": meSettings.cmdType,
            "subprocessTimeout": meSettings.subprocessTimeout,
            "readOnly": meSettings.readOnly
          },
          "defaultKeyNames": meSettings.defaultKeyNames
        };
        /* Set meConfig */
        this.meConfig = objectToReturn;
        /* Return object ro return */
        return objectToReturn;
    }
}