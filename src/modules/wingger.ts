/**
 * Imports
 */
import winston = require('winston');
import CWOptions from '../types/consoleWinstonOptions';
/* Set syslogs levels*/
const sysLevels: Array<string> = ['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'];
/* Set NPM log levels */
const npmLevels: Array<string> = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
/* Set exist levels */
const levelTypes: Array<string> = ['npm', 'syslog'];


/**
 * Class for work win winston logger
 * 
 * @export
 * @class Wingger
 */
export default class Wingger {
    private _levels: Array<string>;
    private _levelType: string;
    private _categories: Object;


    /**
     * Creates an instance of Wingger.
     * @param {string} levelType 
     * 
     * @memberOf Wingger
     */
    constructor(levelType: string) {
        /* Set level type */
        this.levelType = (levelTypes.indexOf(levelType) != -1) ? levelType : 'npm';
        /* Set levels */
        this.levels = (this.levelType == 'npm') ? npmLevels : sysLevels;
    }


    /**
     * Method for add category to winston logger
     * 
     * @param {string} name 
     * @param {string} place 
     * @param {string} dlevel 
     * @param {boolean} colorized 
     * @param {string} label 
     * @returns {winston.LoggerInstance} 
     * 
     * @memberOf Wingger
     */
    public addCategory(name: string, place: string, dlevel: string, colorized: boolean, label: string): winston.LoggerInstance {
        let options: Object;
        let transport: winston.TransportInstance;

        switch (place) {
            case 'console':
                options = this.getConsoleOptions(dlevel, colorized, label);
                break;
            default:
                options = this.getConsoleOptions('debug', false, 'Unknown');
                break
        }
        winston.loggers.add(name, options);
        return winston.loggers.get(name);
    }


    /**
     * Method for get logger category (from winston object)
     * 
     * @param {string} name 
     * @returns {winston.LoggerInstance} 
     * 
     * @memberOf Wingger
     */
    public getLoggerCategory(name: string): winston.LoggerInstance {
        return winston.loggers.get(name);
    }


    /**
     * Method to get console options 
     * 
     * @private
     * @param {string} defaultLevel 
     * @param {boolean} colorized 
     * @param {string} label 
     * @returns {Object} 
     * 
     * @memberOf Wingger
     */
    private getConsoleOptions(defaultLevel: string, colorized: boolean, label: string): Object {
        /* Build object with options */
        const options: Object = {
            level: 'info',
            label: label,
            colorized: colorized
        };

        const cwOptions: CWOptions = new CWOptions(options);

        const categoryOptions: Object = {
            level: cwOptions.level,
            label: cwOptions.label,
            colorize: cwOptions.colorized
        };
        /* Return options */
        return { console: categoryOptions };
    }


    /**
     * Settter for level list of logger
     * 
     * @param {Array<string>} levelList - List with all levels for logger
     * @memberOf Wingger
     */
    set levels(levelList: Array<string>) {
        this._levels = levelList;
    }


    /**
     * Setter for type of levels for logger
     * 
     * @param {string} typeName - Name of type logger (standart)
     * @memberOf Wingger
     */
    set levelType(typeName: string) {
        this._levelType = typeName;
    }


    /**
     * Getter for level
     * 
     * @readonly
     * @type {Array<string>}
     * @memberOf Wingger
     */
    get levels(): Array<string> {
        return this._levels;
    }


    /**
     * Getter for level type
     * 
     * @readonly
     * @type {string}
     * @memberOf Wingger
     */
    get levelType(): string {
        return this._levelType;
    }
}
