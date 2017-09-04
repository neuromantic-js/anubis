import * as express from "express";
/**
 * @export
 * @class CORS
 */
export default class CORS {
    private accessControlAllOrigin: string;
    private accessControlAllowHeaders: string;
    private accessControlAllowMethods: string;
    /**
     * Creates an instance of CORS.
     * 
     * @memberOf CORS
     */
    constructor() {}
    /**
     * Set access control all origin
     * 
     * @param {string} value 
     * 
     * @memberOf CORS
     */
    public setOrigin(value: string): void {
        this.accessControlAllOrigin = value;
    }
    /**
     * Set access control all headers 
     * 
     * @param {string} value 
     * 
     * @memberOf CORS
     */
    public setHeaders(value: string): void {
        this.accessControlAllowHeaders = value;
    }
    /**
     * Set access control all methods
     * 
     * @param {string} value 
     * 
     * @memberOf CORS
     */
    public setMethods(value: string): void {
        this.accessControlAllowMethods = value;
    }
    /**
     * Return this object 
     * 
     * @returns {CORS} 
     * 
     * @memberOf CORS
     */
    public getMe(): CORS {
        return this;
    }
    /**
     * WOrk with CORS
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * 
     * @memberOf CORS
     */
    public cors(req: express.Request, res: express.Response, next: express.NextFunction) {
        /* Some standart headers */
        res.header("Access-Control-Allow-Origin", this.accessControlAllOrigin);
        /* Allowed headers */
        res.header("Access-Control-Allow-Headers", this.accessControlAllowHeaders);
        /* Allowed methods */
        res.header("Access-Control-Allow-Methods", this.accessControlAllowMethods);
        /* Check request method */
        if(req.method == "OPTIONS") {
            res.status(200).json({});
        } else {
            next();
        }
    }
}