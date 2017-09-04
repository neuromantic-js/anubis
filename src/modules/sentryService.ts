import config from "../../configs/config";
import Crypt from "../modules/crypt";
import Logger from "./logger";
import * as Raven from 'raven';
/**
 * @export
 * @class SentryService
 */
export default class SentryService {
    private dns: string;
    private crypt: Crypt;
    private logger: Logger;
    private connection: Object;
    /**
     * Set crypt from global
     * 
     * @private
     * @param {Crypt} value 
     * 
     * @memberOf SentryService
     */
    public setCrypt(value: Crypt): void {
        this.crypt = value;
    }
    /**
     * Creates an instance of SentryService.
     * 
     * @memberOf SentryService
     */
    constructor() {
        /* Set logger options */
        const options = {
            "path": "sentry.connection"
        };
        /* Create new logger object */
        this.logger = new Logger(options);
    }
    /**
     * Set DNS attribute
     * 
     * @param {string} value 
     * 
     * @memberOf SentryService
     */
    public setDns(value: string): void {
        this.dns = value;
    }
    /**
     * Set sentry client in grave
     * 
     * @private
     * @param {Object} value 
     * 
     * @memberOf SentryService
     */
    private setInGrave(value: Object): void {
        /* Set grave */
        const grave = (<any>this.crypt).grave;
        /* Set in grave */
        grave.sentry = value;
    }
    /**
     * Connect to sentry by config 
     * 
     * @memberOf SentryService
     */
    public connect(): void {
        this.logger.console("info", "Try connect to sentry");
        /* Get DNS from sentry */
        const dns = config.sentry.dns;
        /* Check sentry DNS */
        if(dns == undefined) {
            this.logger.console("warn", "Can not connect to sentry!");
        } else {
            /* Set DNS */
            this.setDns(dns);
            /* Try connect to sentry */
            try {
                const ravenClient = new Raven.Client(dns);
                this.logger.console("info", "Successfully connected to sentry!");
                this.connection = ravenClient;
                this.setInGrave(this.connection);
            } catch (e) {
                /* Send error in console */
                this.logger.console("warn", `Can not connect to sentry with error: ${JSON.stringify(e)}`);
            }
        }
    }
}