import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import JWTMiddleware from "../middlewares/jwt-decode";
import { IModel } from "../models/model";

export class MicroservicesList extends BaseRoute {
    /* Attributes */
    private model: IModel;

    private setModel(model: IModel): void {
        this.model = model;
    }
    /**
     *
     * Create the routes
     *
     * @class MicroservicesList
     * @method create
     * @static
     */
    public static create(router: Router, model: IModel) {
        /* Set models */
        console.log("[MicroservicesList::create] Creating micriservice list routeres");
        /* Add access control */
        const jwtMiddleware = new JWTMiddleware();
        router.use(jwtMiddleware.decodeAndWriter);
        /* Add router to get method */
        router.get("/list", (req: Request, res: Response, next: NextFunction) => {
            const routeObject = new MicroservicesList();
            routeObject.setModel(model);
            routeObject.getMicroservicesList(req, res, next);
        });
    }
    /**
     * Constructor
     *
     * @class MicroservicesList
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The information page
     * @class MicroservicesList
     * @method getMicroservicesList
     * @param req {Request} The express request object
     * @param res {Response} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public getMicroservicesList(req: Request, res: Response, next: NextFunction) {
        /* Try get from query param */
        console.log(req.query)
        const skip:number = (req.query.skip)
            ? Number(req.query.skip)
            : 0;
        const limit:number = (req.query.limit)
            ? Number(req.query.limit)
            : 10;
        console.log(skip);
        console.log(limit);
        /* Get count of entries */
        this.model.microservice.count({})
            .then(count => {
                const canNext = (skip <= count)
                    ? true
                    : false;
                const canBack = (skip == 0)
                    ? false
                    : true;
                let nextSkip = undefined;
                let tmp = undefined;
                if(canNext) {
                    if(skip < count) {
                        tmp = skip + limit;
                        if(tmp > count) {
                            nextSkip = skip
                        } else {
                            nextSkip = tmp;
                        }
                    }
                } else {
                    nextSkip = skip;
                }
                const urlNext = (canNext == true)
                    ? "/list?skip=" + nextSkip + "&limit=" + limit
                    : undefined;
                const backSkip = (canBack)
                    ? (skip-limit > 0)
                    ? skip-limit
                    : 0
                :0 ;
                const urlBack = (canNext == true)
                    ? "/list?skip=" + backSkip + "&limit=" + limit
                    : undefined;
                console.log(urlBack)
                console.log(String(nextSkip) == String(skip));
                /* Find all microservices */
                this.model.microservice.find()
                    .skip(skip)
                    .limit(limit)
                    .then(result => {
                        /* Set response options */
                        const options: Object = {
                            "header": "Список микросервисов",
                            "count": (result.length !== 0)
                                ? true
                                : false,
                            "result": result,
                            "limit": limit,
                            "canNext": canNext,
                            "canBack": canBack,
                            "nextSkip": nextSkip,
                            "backSkip": backSkip,
                            "urlNext": urlNext,
                            "urlBack": urlBack,
                            "nextSee": (String(nextSkip) == String(skip))
                                ? false
                                : true
                        };
                        //console.log(options);
                        /* Set title */
                        this.title = "Microservices | Maman Brigitte"
                        /* Return render */
                        this.render(req, res, "list.pug", options);
                    })
                    .catch(error => {
                        throw error;
                    });
            })
            .catch(error => {
                throw error;
            });
    }
}
