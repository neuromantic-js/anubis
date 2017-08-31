import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import AuthData from "../types/authData";
import AuthLobster from "../modules/auth-lobster";
/**
 *
 * @class LoginRoute
 */
export class LoginRoute extends BaseRoute {
    /**
     *
     * Create the routes
     *
     * @class BaronRoute
     * method create
     * @static
     */
    public static create(router: Router) {
        console.log("[LoginRoute::create] Creating login router");
        /* Add page with login form */
        router.get("/login", (req: Request, res: Response, next: NextFunction) => {
            new LoginRoute().getLoginForm(req, res, next);
        });
        /* Add answer reaction */
        router.post("/login", (req: Request, res: Response, next: NextFunction) => {
            new LoginRoute().checkAuthData(req, res, next);
        });
    }
    /**
     * Constructor
     *
     * @class LoginRoute
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The information page route
     * @class LoginRoute
     * @method getLoginForm
     * @param req {Request} The express request object
     * @param res {Response} The express response object
     * @next {NextFunction} Execute the next method
     */
    public getLoginForm(req: Request, res: Response, next: NextFunction) {
        /* Set custom title */
        this.title = "Login | Baron Saturday";
        /* Set options */
        const options: Object = {
            message: "Please login"
        };
        /* Render template */
        this.render(req, res, "login.pug", options);

    }
    public checkAuthData(req: Request, res: Response, next: NextFunction) {
        /* Get body object */
        const authData: AuthData  = new AuthData(req.body);
        const authLobster: AuthLobster = new AuthLobster(authData);
        /* Try login */
        authLobster.login(authData)
            .then(answer => {
                /* Redirect to list of microservices */
                res.cookie("token", answer.meta.token);
                res.redirect("/list");
            })
            .catch(error => {
                // TODO add error handler
                throw error;
            });
    }
}
