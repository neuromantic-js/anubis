import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
/**
 * / route
 *
 * @class Index route
 */
export class IndexRoute extends BaseRoute {
    /**
     * Create the routes
     *
     * @class IndexRoute
     * @method create
     * @static
     */
    public static create(router: Router) {
        console.log("[IndexRoute::create] Creating index route.");
        /* Add home page route */
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        });
    }
    /**
     * Constructor
     *
     * @class IndexRoute
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public index(req: Request, res: Response, next: NextFunction) {
        /* Set custom title */
        this.title = "Home | Maman Brigitte";
        /* Set options */
        let options: Object = {
            "message": "Welcome to catalog of microservices"
        };
        /* Render template */
        this.render(req, res, "about.pug", options);
    }
}
