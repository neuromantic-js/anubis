/* Import env2conf module */
import * as env2conf from 'env2conf';
/* Create empty object env2conf */
const conf = env2conf.load({});
/* Create simple object */
const ciConfig: Object = {
  "mongo": {
    "host": conf.MONGO_HOST || "localhost",
    "port": conf.MONGO_PORT || 27017,
    "auth": conf.MONGO_AUTH || false,
    "user": conf.MONGO_USER || "",
    "password": conf.MONGO_PWD || "",
    "dbname": conf.MONGO_DBNAME || "baron-samedi"
  },
  "redis": {
    "host": conf.REDIS_HOST || "localhost",
    "port": conf.REDIS_PORT || 6379
  },
  "pgsql": {
    "host": conf.PGSQL_HOST || "localhost",
    "pool": {
      "max": conf.PGSQL_POOL_MAX || 5,
      "min": conf.PGSQL_POOL_MIN || 0,
      "auth": conf.PGSQL_AUTH || true,
      "user": conf.PGSQL_USER || "baron",
      "password": conf.PGSQL_PWD || "samedi",
      "dbname": conf.PGSQL_DBNAME || "baron-samedi"
    }
  },
  "sentry": {
    "dns": conf.SENTRY_DNS
  },
  "jwt": {
    "salt": conf.JWT_SALT || "123xyz",
    "referrer": conf.JWT_REFERRER || "baron",
    "provider": conf.JWT_PROVIDER || "https://auth.baron.io"
  }
};
export default ciConfig;