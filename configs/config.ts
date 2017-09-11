const config =  {
  "cors": {
    "origin": "*",
    "headers": "referrer, x-access-token, Origin, X-Requested-With, Content-Type, Accept, x-language, X-CSRFToken",
    "methods": "GET, POST, HEAD, PUT, DELETE, OPTIONS"
  },
  "sentry": {
    "dns": "https://ea3e15af4cf248a7929ad4ce6adc097b:39c73fe0669b4b94a6d2612eaea1af93@sentry.dev.cloud.itlabs.io/20",
    "levels": ["WARN", "ERROR"]
  },
  "server" : {
    "host": "localhost",
    "port": 8080,
  },
  "logger": {
    "errorHandler": "custom",
    "level": "errors",
    "type": "json",
    "console": true
  },
  "databases" :{
    "main": "mongodb",
    "cache": "redis",
    "mongodb": {
      "host": "localhost",
      "port": 27017,
      "auth": false,
      "user": "",
      "password": "",
      "dbname": "baron-samedi"
    },
    "redis": {
      "host": "localhost",
      "port": 6379
    },
    "pgsql": {
      "host": "localhost",
      "pool": {
        "max": 5,
        "min": 0,
        "idle": 10000
      },
      "auth": true,
      "user": "neuromantic",
      "password": "example",
      "dbname": "baron-samedi"
    }
  },
  "jwt": {
    "salt": "123xyz",
    "referrer": "baron",
    "provider": "https://auth.baron.io"
  },
  "mongoExpress": {
    "run": true,
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
    "basicAuthPassword":"samedi",
    "documentPerPage": 10,
    "editorTheme": "rubyblue",
    "maxPropSize": (100*1000),
    "maxRowSize": (1000*1000),
    "cmdType": "eval",
    "subprocessTimeout": 300,
    "readOnly": false,
    "defaultKeyNames": {},
    "url":"mongodb://localhost27017/baron-samedi"
  }
};
export default config;