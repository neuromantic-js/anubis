import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { IModel } from "../models/model";
import JWTMiddleware from "../middlewares/jwt-decode";
/**
 *
 * @class ViewCardRouter
 */
export class ViewCardRouter extends BaseRoute {
    /* Attributes */
    private model: IModel;

    private setModel(model: IModel):void {
        this.model = model
    }
    /**
     *
     * Create the routes
     *
     * @class ViewCardRouter
     * method create
     * @static
     */
    public static create(router: Router, model: IModel) {
        console.log("[ViewCardRouter::create] Creating create new entry router");
        /* Add page with microservice card form */
        router.get("/card/:id", (req: Request, res: Response, next: NextFunction) => {
            /* Add access control */
            const jwtMiddleware = new JWTMiddleware();
            router.use(jwtMiddleware.decodeAndWriter);
            /* Add model to request */
            const routerObject = new ViewCardRouter();
            routerObject.setModel(model);
            routerObject.seeCurrentCard(req, res, next);
        });
        router.post("/card/:id", (req: Request, res: Response, next: NextFunction) => {
            /* Add access control */
            const jwtMiddleware = new JWTMiddleware();
            router.use(jwtMiddleware.decodeAndWriter);
            /* Add model to request */
            const routerObject = new ViewCardRouter();
            routerObject.setModel(model);
            routerObject.changeCurrentCard(req, res, next);
        });
    }
    /**
     * Constructor
     *
     * @class ViewCardRouter
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The page to view card
     * @class ViewCardRouter
     * @method seeCurrentCard
     * @param req {Request} The express request object
     * @param res {Response} The express response object
     * @next {NextFunction} Execute the next method
     */
    public seeCurrentCard(req: Request, res: Response, next: NextFunction) {
        /* Set custom title */
        this.title = "View microservice card | Maman Brigitte";
        /* Try get id */
        const cardId = req.params.id;
        const role = req.body.decoded.getRule();
        this.model.microservice.find({
            "_id": cardId
        })
            .then(result => {
                /* Set render options */
                const options: Object = {
                    isError: false,
                    isEmpty: (result.length == 0)
                        ? true
                        : false,
                    result: result[0],
                    header: "Просмотр карточки микросервиса",
                    isReader: (role === "reader")
                        ? true
                        : false,
                    isModerator: (role === "moderator")
                        ? true
                        : false,
                    isRoot: (role === "root")
                        ? true
                        : false
                };
                /* Return render */
                this.render(req, res, "card.pug", options);
            })
            .catch(error => {
                /* Set render options */
                const options: Object = {
                    isError: true,
                    isEmpty: false,
                    result: undefined
                };
                /* Return render */
                this.render(req, res, "card.pug", options);
            });
    }
    public changeCurrentCard(req: Request, res: Response, next: NextFunction) {
        const cardId = req.params.id;
        const role = req.body.decoded.getRule();

        this.model.microservice.find({
            "_id": cardId
        })
            .then(result => {
                /* Set render options */
                const options: Object = {
                    isError: false,
                    isEmpty: (result.length == 0)
                        ? true
                        : false,
                    result: result[0],
                    header: "Просмотр карточки микросервиса",
                    isReader: (role === "reader")
                        ? true
                        : false,
                    isModerator: (role === "moderator")
                        ? true
                        : false,
                    isRoot: (role === "root")
                        ? true
                        : false,
                    isSaveError: false,
                    isSavedSuccess: false
                };
                /* Check isEmpty option */
                if(result.length === 0) {
                    /* Return render */
                    this.render(req, res, "card.pug", options);
                } else {
                    const modelKeys = Object.keys(this.model.microservice.schema.obj);
                    /* Update fields */
                    for(let entry of modelKeys) {
                        result[0][entry] = req.body[entry];
                    }
                    result[0].save()
                        .then(saved => {
                            /* Set options */
                            const options:Object = {
                                isError: false,
                                isEmpty: false,
                                result: result[0],
                                header: "Просмотр карточки микросервиса",
                                isReader: (role === "reader")
                                    ? true
                                    : false,
                                isModerator: (role === "moderator")
                                    ? true
                                    : false,
                                isRoot: (role === "root")
                                    ? true
                                    : false,
                                isSaveError: false,
                                isSavedSuccess: true
                            };
                            console.log('asd', options);
                            /* Return rended */
                            this.render(req, res, "card.pug", options);
                        })
                        .catch(error => {
                            /* Set options */
                            const options:Object = {
                                isError: false,
                                isEmpty: false,
                                result: result[0],
                                header: "Просмотр карточки микросервиса",
                                isReader: (role === "reader")
                                    ? true
                                    : false,
                                isModerator: (role === "moderator")
                                    ? true
                                    : false,
                                isRoot: (role === "root")
                                    ? true
                                    : false,
                                isSaveError: true,
                                isSavedSuccess: false
                            };
                            /* Return render */
                            this.render(req, res, "card.pug", options);
                        });
                }
            })
            .catch(error => {
                /* Set render options */
                const options: Object = {
                    isError: true,
                    isEmpty: false,
                    result: undefined
                };
                /* Return render */
                this.render(req, res, "card.pug", options);
            });
    }
}
