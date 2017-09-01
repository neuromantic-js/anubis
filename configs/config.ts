const config =  {
    "server" : {
        "host": "localhost",
        "port": 8080,
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
