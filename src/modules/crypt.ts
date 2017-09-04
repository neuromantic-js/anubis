import mongoose = require("mongoose");
/**
 * @export
 * @class Crypt
 */
export default class Crypt {
    /**
     * @private
     * @type {string}
     * @memberOf Crypt
     */
    private name: string;
    private grave: Object;
    /**
     * Set crypt name
     * 
     * @private
     * 
     * @memberOf Crypt
     */
    private setName(): void {
        this.name = `crypt-${Math.ceil(Math.random() * 100)}`;
    }
    /**
     *  Set grave (instance crypt options in GLOBAL)
     * 
     * @private
     * @param {Object} value 
     * 
     * @memberOf Crypt
     */
    private setGrave(value: Object): void {
        this.grave = value;
    }
    /**
     * Get crypt name
     * 
     * @returns {string} 
     * 
     * @memberOf Crypt
     */
    public getName(): string {
        return this.name;
    }
    /**
     * Get all crypt object 
     * 
     * @returns {Crypt} 
     * 
     * @memberOf Crypt
     */
    public getCrypt(): Crypt {
        return this;
    }
    /**
     * Creates an instance of Crypt.
     * 
     * @memberOf Crypt
     */
    constructor() {
        this.setName();
        console.log("Baron Samedi say: \"Run to fill the grave\".");
        console.log(`Placard on the Crypt:  ${this.name}.`);
        /* Set crypt JSON,
         *  */
        const cryptObject: Object = {
            name: this.name,
            sentry: undefined,
            mongo: undefined,
            pqsql: undefined,
            models: undefined
        };
        /* Set grave in crypt */
        this.setGrave(cryptObject);
        /* Create crypt object on global 
         * NodeJS object*/
        Object.defineProperty(global, this.name, {
            value: cryptObject,
            writable: true,
            configurable: true
        });
        /* Retrun object after
         * creation */
        return this;
    }
    /**
     * Set mongo connection in grave
     * 
     * @param {mongoose.Connection} value 
     * 
     * @memberOf Crypt
     */
    public setMongo(value: mongoose.Connection): void {
        (<any>this.grave).mongo = value;
    }
}