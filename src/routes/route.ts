import { NextFunction, Request, Response } from "express";
/**
 * Constructor
 *
 * @class Base Route
 */
export class BaseRoute {

    protected title: string;
    private scripts: string[];
    /**
     * Constructor
     *
     * @class VaseRoute
     * @constructor
     */
    constructor() {
        /* Initialize variables */
        this.title = "Baron Saturday";
        this.scripts = [];
    }
    /**
     * Add a JS external file to the request.
     *
     * @class BaseRoute
     * @method addScript
     * @param src {string} The src to the external JS file.
     * @return {BaseRoute} Self for chaining
     */
    public addScript(src: string): BaseRoute {
        this.scripts.push(src);
        return this;
    }
    /**
     * Render a page.
     *
     * @class BaseRoute
     * @method render
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param view {String} The views to render.
     * @param options {Object} Additional options to append to the views's local scope.
     * @return void
     */
    public render(req: Request, res: Response, view: string, options?: Object) {
        /* Add constants */
        res.locals.BASE_URL = "/";
        /* Add scripts */
        res.locals.scripts = this.scripts;
        /* Add title */
        res.locals.title = this.title;
        /* Render views */
        res.render(view, options);
    }
}
