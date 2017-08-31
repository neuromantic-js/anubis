import intel = require("intel");
/**
 * @class Logger
 */
export default class Logger {
    /* Set class variables */
    private path: string;
    /**
     * Set level for logger
     *
     * @class Logger
     * @method Logger
     * @param value {String} Value of loger path 
     */
    private setLevel(value: string): void {
        this.path = value;
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
        switch(logLevel) {
        case "TRACE":
            log.trace(message);
            break;
        case "VERBOSE":
            log.verbose(message);
            break;
        case "DEBUG":
            log.debug(message);
            break;
        case "INFO":
            log.info(message);
            break;
        case "WARN":
            log.warn(message);
            break;
        case "ERROR":
            log.error(message);
            break;
        case "CRITICAL":
            log.critical(message);
            break;
        default:
            log.info(message);
            break;
        }
    }
}
