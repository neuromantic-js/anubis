import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import SBI from 'sbi';
import winston = require('winston');


export class LoginRoute extends BaseRoute {


  public static create(router: Router) {
    const storage = new SBI();
    const logger = storage.get('logger').item();
    const loginLogger: winston.LoggerInstance = (<any>logger).addCategory('LoginRouter', 'console', 'info', true, `${process.pid}/Login`);
    const options = {
      path: 'LoginRoute.creation',
    };

    storage.set({
      key: 'LoginRoute',
      value: loginLogger
    });

    loginLogger.info('Create login & logput page');
    
    router.get("/login", (req: Request, res: Response, next: NextFunction) => {
        new LoginRoute().getLoginForm(req, res, next);
    });
        
    router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
      new LoginRoute().logout(req, res, next);
    });
  }
    
  
  public getLoginForm(req: Request, res: Response, next: NextFunction) {
    const storage: SBI = new SBI();
    const loginLogger: winston.LoggerInstance = storage.get('LoginRoute').item();

    this.title = 'Авторизация | Anubis';
    
    const pageOptions: Object = {
      message: 'Для входа введите логин и пароль',
      isAuth: false
    };
    
    try {
      loginLogger.info('Get login form');
      this.render(req, res, "login.pug", pageOptions);
    } catch (e) {
      loginLogger.error(JSON.stringify(e));
      const error = new Error(e);
      next(error);
    }
  }
  
  public logout(req: Request, res: Response, next: NextFunction) {
    const storage: SBI = new SBI();
    const loginLogger: winston.LoggerInstance = storage.get('LoginRoute').item();

    this.title = 'Выход | Anubis';

    const pageOptions: Object = {
      message: 'Для входа введите логин и пароль',
      isAuth: false
    };

    try {
      loginLogger.info('Get logout page');
      this.render(req, res, 'logout.pug', pageOptions);
    } catch (e) {
      loginLogger.error('Can not get logout page');
      const error = new Error(e);
      next(error);
    }
  }
}
