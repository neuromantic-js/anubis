import configs from "./config";

const mongo = configs.databases.mongodb;
const mongoExpress = configs.mongoExpress;
const server = configs.server;

const mongoExpressConfig = {
    "mongodb": {
        "connectionString": "mongodb://localhost:27017/baron-samedi",
        "server": mongo.host,
        "port": mongo.port,
        "autoReconnect": mongoExpress.autoReconnect,
        "poolSize": mongoExpress.poolSize,
        "admin": mongoExpress.enableAdmin,
        "auth": [{
            "database": mongo.dbname,
            "username": mongo.user,
            "password": mongo.password
        }],
        "adminUser": mongoExpress.login,
        "adminPassword": mongoExpress.password,
        "whitelist": [],
        "blacklist": [],
    },
    "site": {
        "baseUrl": mongoExpress.baseUrl,
        "cookieKeyName": mongoExpress.cookieKeyName,
        "cookieSecret": mongoExpress.cookieSecret,
        "host": server.host,
        "port": server.host,
        "requestSizeLimit": mongoExpress.requestSizeLimit,
        "sessionSecret": mongoExpress.sessionSecret,
        "sslKey": mongoExpress.sslKey,
        "sslEnabled": mongoExpress.sslEnabled,
        "sslCert": mongoExpress.sslCert,
    },
    "useBasicAuth": mongoExpress.useBasicAuth,
    "basicAuth": {
        "username": mongoExpress.basicAuthLogin,
        "password": mongoExpress.basicAuthPassword
    },
    "options": {
        "documentPerPage": mongoExpress.documentPerPage,
        "editorTheme": mongoExpress.editorTheme,
        "maxPropSize": mongoExpress.maxPropSize,
        "maxRowSize": mongoExpress.maxRowSize,
        "cmdType": mongoExpress.cmdType,
        "subprocessTimeout": mongoExpress.subprocessTimeout,
        "readOnly": mongoExpress.readOnly
    },
    "defaultKeyNames": mongoExpress.defaultKeyNames
}
export default mongoExpressConfig;
