import intel = require("intel");
import config from "../../configs/config";
import SBI from "sbi";
/**
 * @class Logger
 */
export default class Logger {
  /* Set class variables */
  private path: string;
  private storage: SBI;
    /**
     * Set level for logger
     *
     * @class Logger
     * @method Logger
     * @param value {String} Value of loger path 
     */
    private setLevel(value: string): void {
        this.path = value;
        this.storage = new SBI();
    }
    /**
     * Constructor
     *
     * @class Logger
     * @constructor
     */
    constructor(obj) {
        this.setLevel(String(obj.path));
    }
    /**
     * Get message in console
     * wit intel module.
     *
     * @class Logger
     * @method console
     * @param level {String} Name of logger level
     * @param message {String} Message to output
     */
    public console(level: string, message: string):void {
        /* Set logger level */
        const logLevel = level.toUpperCase();
        /* Set logger level */
        let log = intel.getLogger(this.path);
        log.setLevel(intel[logLevel]);
        /* Switch case */
        const loggerLevels: Array<string> = [
            "TRACE",
            "VERBOSE",
            "DEBUG",
            "INFO",
            "WARN",
            "ERROR",
            "CRITICAL"        
        ];
        /* Check log level */
        if(loggerLevels.indexOf(logLevel) != -1) {
            log[logLevel.toLowerCase()](message);
        } else {
            log.info(message);
        }
        /* Set sentry levels array */
        const sentryLevels = config.sentry.levels;
        /* Check crypt object &
         * find level in settings (config object) */
        if(sentryLevels.indexOf(logLevel) != -1) {
                /* Set tags array */
                const tags: Array<string> = [
                    this.path,
                    logLevel,
                    "sentry"
                ];
                /* Set sentry client  */
                const sentryClient = this.storage.get("sentry").item();
                /* Check sentry client */
                if(sentryClient != undefined) {
                    /* Set options object */
                    const options: Object = {
                        "extra": message,
                        "level": logLevel,
                        "tags": tags
                    };
                    /* Try send message to sentry */
                    try {
                        sentryClient.captureMessage(message, options);
                    } catch (e) {
                        log.warn(`Can not message to sentry! Error: ${JSON.stringify(e)}`);
                    }
                } else {
                    log.warn("Senty not connected. Can not send message/error");
                }
        }
    }
}
