import * as express from "express";
/**
 * @export
 * @class language
 */
export default class language {
    /**
     * Creates an instance of language.
     * 
     * @memberOf language
     */
    constructor() {}
    /**
     * ADd language to request
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * 
     * @memberOf language
     */
    public addLanguageToRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Get from headers or set */
        const language = req.headers["x-language"]
            ? String(req.headers["x-language"]).toLowerCase()
            : "en";
        /* Add prop to request */
        Object.defineProperty(req, "language", {
            value: language,
            writable: true,
            configurable: true
        });
        next();
    }
}