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
            "user": "neuromantic",
            "example": "example",
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
        "salt": "052lrWngfxVv",
        "referrer": "sdvor",
        "provider": "https://auth.itlabs.io"
    }
};
export default config;
