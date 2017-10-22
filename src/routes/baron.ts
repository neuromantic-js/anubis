import { create } from 'domain';
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import SBI from 'sbi';
import winston = require('winston');


export class BaronRoute extends BaseRoute {


    public static create(router: Router) {
        const options = {
            path: 'BaronRoute.create'
        };
        const storage = new SBI();
        const logger = storage.get('logger').item();
        const  baronRouter: winston.LoggerInstance = (<any>logger).addCategory('BaronRouter', 'console', 'info', true, `${process.pid}/Information`);
        
        storage.set({
            key: 'BaronRouter',
            value: baronRouter
        });

        baronRouter.info('Create information router');

        router.get('/baron', (req: Request, res: Response, next: NextFunction) => {
            new BaronRoute().getBaronInfo(req, res, next);
        });
    }


    constructor() {
        super();
    }
    
    
    public getBaronInfo(req: Request, res: Response, next: NextFunction) {
        const storage: SBI = new SBI();
        const baronRouter: winston.LoggerInstance = storage.get('BaronRouter').item();

        this.title = 'About | Baron Samedi';


        let pageOptions: Object = {
          message: 'Biolerpate for NodeJS/Express based on Typescript',
          isAuth: false
        };
    
        try {
            baronRouter.info('Call information page');
            this.render(req, res, 'about.pug', pageOptions);
        } catch (e) {
            baronRouter.error('Can not information page');
            const error = new Error(e);
            next(error);
        }
    }
}
