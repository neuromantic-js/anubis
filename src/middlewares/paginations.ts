/**
 * Imports
 */
import * as express from 'express';


/**
 * Class for work get pagination information from requst & inject it as atrribute 
 * 
 * @export
 * @class Pagination
 */
export default class Pagination {


    /**
     * Creates an instance of Pagination.
     * 
     * @memberOf Pagination
     */
    constructor() { }


    /**
     * Method for get & inject pagination object
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * 
     * @memberOf Pagination
     */
    public init(req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Set undefined/empty object */
        let pagination: Object;
        let limit: number;
        let skip: number;
        let sort: any;
        let container: any;
        /* Get method */
        const method: string = req.method;
        /* Check method & set container */
        container = (method == 'GET') ? req.query : req.body;
        /* Set some vars */
        limit = (container.limit) ? Number(container.limit) : 10;
        skip = (container.skip) ? Number(container.skip) : 0;
        sort = (container.sort) ? String(container.sort) : {};
        /* Init object */
        pagination = { skip, sort, limit };
        /* Inject in request */
        Object.defineProperty(req, 'pagination', {
            value: pagination,
            writable: true,
            configurable: true
        });
        /* Go down */
        next();
    }
}
