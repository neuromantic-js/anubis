import config from "../../configs/config";
import Logger from "./logger";
import * as Raven from 'raven';
import SBI from "sbi";
/**
 * @export
 * @class SentryService
 */
export default class SentryService {
    private dns: string;
    private storage: SBI;
    private logger: Logger;
    private connection: Object;

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
        /* Get storage */
        this.storage = new SBI();
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
      let sentryObject = this.storage.get("sentry").item();
      sentryObject = value;
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