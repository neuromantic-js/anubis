import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
/**
 *
 * @class route
 */
export class BaronRoute extends BaseRoute {
    /**
     *
     * Create the routes
     *
     * @class BaronRoute
     * method create
     * @static
     */
    public static create(router: Router) {
        console.log("[BaronRouter::create] Creating baron router");
        /* Add page with informations for BaronSaturdayBoilerplate */
        router.get("/baron", (req: Request, res: Response, next: NextFunction) => {
            new BaronRoute().getBaronInfo(req, res, next);
        });
    }
    /**
     * Constructor
     *
     * @class BaronRouter
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The information page route
     * @class BaronRoute
     * @method getBaronInfo
     * @param req {Request} The express request object
     * @param res {Response} The express response object
     * @next {NextFunction} Execute the next method
     */
    public getBaronInfo(req: Request, res: Response, next: NextFunction) {
        /* Set custom title */
        this.title = "About | Mamn Brigitte";
        /* Set options */
        let options: Object = {
            "message": "Welcome to catalog of microservices"
        };
        /* Render template */
        this.render(req, res, "about.pug");

    }
}
