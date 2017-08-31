import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import JWTMiddleware from "../middlewares/jwt-decode";
import { IModel } from "../models/model";
/**
 *
 * @class CreateEntryRouter
 */
export class CreateEntryRouter extends BaseRoute {
    /* Attributes */
    private model: IModel;

    private setModel(model: IModel) {
        this.model = model;
    }
    /**
     *
     * Create the routes
     *
     * @class CreateEntry
     * method create
     * @static
     */
    public static create(router: Router, model: IModel) {
        console.log("[CreateEntryRouter::create] Creating create new entry router");
        const jwtDecode = new JWTMiddleware();
        router.use(jwtDecode.decodeAndWriter);
        /* Add page with login form */
        router.get("/create", (req: Request, res: Response, next: NextFunction) => {
            /* Add model */
            const routeObject = new CreateEntryRouter();
            routeObject.setModel(model);
            /* Render */
            routeObject.getNewCardForm(req, res, next);
        });
        /* Add answer reaction */
        router.post("/create", (req: Request, res: Response, next: NextFunction) => {
            /* Add access control */
            const routeObject = new CreateEntryRouter();
            routeObject.setModel(model);
            /* Render */
            routeObject.saveNewEntry(req, res, next);
        });
    }
    /**
     * Constructor
     *
     * @class CreateEntryRouter
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The page to add new microservice card
     * @class CreateEntryRouter
     * @method getNewCardForm
     * @param req {Request} The express request object
     * @param res {Response} The express response object
     * @next {NextFunction} Execute the next method
     */
    public getNewCardForm(req: Request, res: Response, next: NextFunction) {
        /* Set custom title */
        this.title = "Create new entry | Maman Brigitte";
        /* Set options */
        const options: Object = {
            header: "Создать карточку проекта",
            isError: false,
            ifSuccess: false
        };
        /* Render template */
        this.render(req, res, "create.pug", options);

    }
    public saveNewEntry(req: Request, res: Response, next: NextFunction) {
        /* Create new object to save */
        const objectToSave = new this.model.microservice(req.body);
        /* Try save in mongodb */
        objectToSave.save()
            .then(answer => {
                /* Set options */
                const options: Object = {
                    header: "Создать карточку проекта",
                    isError: false,
                    isSuccess: true
                };
                /* Call render */
                this.render(req, res, "create.pug", options);
            })
            .catch(error => {
                /* Set options ibject */
                const options: Object = {
                    header: "Создать карточку проекта",
                    isError: true,
                    isSuccess: false
                };
                /* Call render */
                this.render(req, res, "create.pug", options);
            });
    }
}
