import { IOrder } from '../interfaces/order';
import { INestedUser } from '../interfaces/nestedUser';
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import SBI from 'sbi';
import { Model } from 'mongoose';
import { NestedUserSchema } from '../schemas/UserNested';
import winston = require('winston');

export class OrdersRoute extends BaseRoute {

  public static create(router: Router) {
    const storage: SBI = new SBI();
    const options: Object = {
      path: 'OrdersRoute.creation'
    };
    const logger = storage.get('logger').item();
    const ordersLogger: winston.LoggerInstance = (<any>logger).addCategory('OrdersRouter', 'console', 'info', true, `${process.pid}/Orders`);
    storage.set({
      key: 'OrdersRoute',
      value: ordersLogger
    });
    ordersLogger.info('Create pages for works with orders');
    
    router.get('/orders', (req: Request, res: Response, next: NextFunction) => {
      new OrdersRoute().getOrdersList(req, res, next);
    });
    router.get('/orders/create', (req: Request, res: Response, next: NextFunction) => {
      new OrdersRoute().getCreateOrderForm(req, res, next);
    });
    router.post('/orders/create', (req: Request, res: Response, next: NextFunction) => {
      new OrdersRoute().saveOrderDocument(req, res, next);
    });
    router.get('/orders/:name', (req: Request, res: Response, next: NextFunction) => {
      new OrdersRoute().getEditOrderForm(req, res, next);
    });
    router.post('/orders/:name', (req: Request, res: Response, next: NextFunction) => {
      new OrdersRoute().updateOrderEntry(req, res, next);
    });
    router.get('/projects', (req: Request, res: Response, next: NextFunction) => {
      new OrdersRoute().getAllProjects(req, res, next);
    });
    router.get('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
      new OrdersRoute().getProjectCard(req, res, next);
    });
  }
  
  constructor() {
    super();
  }
  
  public getOrdersList(req: Request, res: Response, next: NextFunction) {
    const storage: SBI = new SBI();
    const ordersRouter: winston.LoggerInstance = storage.get('OrdersRoute').item();

    this.title = 'Список заказов | Anubis';
    
    const pageOptions: Object = {
      message: 'Выберите из списка',
      isAuth: true
    };
    
    try {
      ordersRouter.info('Get orders list');
      this.render(req, res, 'orders.pug', pageOptions);
    } catch (e) {
      ordersRouter.error('Can not get orders list');
      const error = new Error(e);
      next(error);
    }
  }


  public getAllProjects(req: Request, res: Response, next: NextFunction) {
    const storage: SBI = new SBI();
    const ordersRouter: winston.LoggerInstance = storage.get('OrdersRoute').item();

    this.title = 'Список проектов | Anubis';

    const pageOptions: Object = {
      message: 'Выберите из списка',
      isAuth: true
    };


    try {
      ordersRouter.info('Get all projects');
      this.render(req, res, 'orders.pug', pageOptions);
    } catch (e) {
      ordersRouter.error('Can not get all projects');
      const error = new Error(e);
      next(error);
    }
  }
  
  public getCreateOrderForm(req: Request, res: Response, next: NextFunction) {
    const storage: SBI = new SBI();
    const ordersLogger: winston.LoggerInstance = storage.get('OrdersRoute').item();

    this.title = 'Создание заказа | Anubis';

    const pageOptions: Object = {
      message: 'Введите данные в форму',
      isAuth: true
    };


    try {
      ordersLogger.info('Get create order form');
      this.render(req, res, 'create.pug', pageOptions);
    } catch (e) {
      ordersLogger.error('Can not get create order from');
      const error = new Error(e);
      next(error);
    }
  }

  public async saveOrderDocument(req: Request, res: Response, next: NextFunction): Promise<any> {
    const storage: SBI = new SBI();
    const ordersLogger: winston.LoggerInstance = storage.get('OrdersRoute').item();

    this.title = 'Создание заказа | Anubis';

    let pageOptions: Object;


    const owner: INestedUser = {
      username: req.body.owner,
      isProductOwner: true,
      isFreelancer: false
    };

    const freelancer: INestedUser = {
      username: req.body.freelancer,
      isProductOwner: false,
      isFreelancer: true
    }

    const OrderObject: IOrder = {
      name: req.body.name,
      dates: {
        dateOfPublication: req.body.dateOfPublication,
        dateStartOfWork: req.body.dateStartOfWork,
        dateEndOfWork: req.body.dateEndOfWork,
        dateOfRepublication: req.body.dateOfRepublication,
        dateAcceptOfWorks: req.body.dateAcceptOfWorks
      },
      state: req.body.state,
      description: req.body.description,
      trustIndex: 0,
      productOwner: owner,
      freelancer: freelancer,
      linkToTechnicalProject: req.body.linkToTechnicalProject
    };

    const models = storage.get('model').item();
    const OrderModel = (<any>models).Order;
    const documentToSave = new OrderModel(OrderObject);

    try {
      const savedDocument = await documentToSave.save();
      
      pageOptions = {
        message: 'Введите данные в форму',
        isAuth: true,
        isSuccess: true
      };

      ordersLogger.info('Post create order form');
      this.render(req, res, 'create.pug', pageOptions);
    } catch (e) {
      
      pageOptions  = {
        message: 'Введите данные в форму',
        isAuth: true,
        isFailed: true
      }

      ordersLogger.error('Can not post create order from');
      this.render(req, res, 'create.pug', pageOptions);
    }

  }
  
  public async getEditOrderForm(req: Request, res: Response, next: NextFunction): Promise<any> {
    const storage: SBI = new SBI();
    const ordersLogger: winston.LoggerInstance = storage.get('OrdersRoute').item();
    const models: Object = storage.get('model').item();
    const OrderModel = (<any>models).Order;

    const findedModel = await OrderModel.findOne({ name: req.params.name });

    this.title = 'Список заказов | Anubis';

    const pageOptions: Object  = {
      message: 'Отредактируйте данные проекта',
      isAuth: true,
      isFind: !!(findedModel != null),
      order: findedModel,
    };
    
    try {
      ordersLogger.info('Get update order form');
      this.render(req, res, 'edit.pug', pageOptions);
    } catch (e) {
      ordersLogger.error('Can not update order form');
      this.render(req, res, 'edit.pug', pageOptions);
    }
  }

  public async updateOrderEntry(req: Request, res: Response, next: NextFunction): Promise<any> {
    const storage: SBI = new SBI();
    const ordersLogger: winston.LoggerInstance = storage.get('OrdersRoute').item();
    const models: Object = storage.get('model').item();
    const OrderModel = (<any>models).Order;

    this.title = 'Список заказов | Anubis';
    /* Update all fields */
    const fieldsToUpdate: Array<string> = Object.keys(req.body);
    const findedEntry = await OrderModel.findOne({ name: req.params.name });

    if(findedEntry != null) {
      for(let field of fieldsToUpdate) {
        console.log(field);
        if(field !== 'owner' && field != 'freelancer' && field != 'save') {
          (<any>findedEntry)[field] = req.body[field];
        }
      }

      const nameOfOwner = ((<any>findedEntry).productOwner) ? (<any>findedEntry).productOwner.username : undefined;
      const nameOfFreelancer = ((<any>findedEntry).freelancer) ? (<any>findedEntry).freelancer.username : undefined;

      if(nameOfOwner != req.body.owner) {
        const newOwner: INestedUser = {
          username: req.body.owner,
          isProductOwner: true,
          isFreelancer: false
        };
        (<any>findedEntry).productOwner = newOwner;
      }
      if(nameOfFreelancer != req.body.freelancer) {
        const newFreelancer: INestedUser = {
          username: req.body.freelancer,
          isProductOwner: false,
          isFreelancer: true
        };
        (<any>findedEntry).freelancer = newFreelancer;
      }
    }
    /* Create page options */
    let pageOptions: Object;

    try {
      const updatedEntry = await findedEntry.save();

      pageOptions = {
        message: 'Отредактируйте данные проекта',
        isAuth: true,
        isFind: true,
        order: updatedEntry,
        isUpdate: true
      };

      ordersLogger.info('Post update order form');
      this.render(req, res, 'edit.pug', pageOptions);
    } catch (e) {
      pageOptions = {
        message: 'Отредактируйте данные проекта',
        isAuth: true,
        isFind: true,
        order: findedEntry,
        isFailed: true
      };

      ordersLogger.error('Can not post update order form');
      this.render(req, res, 'edit.pug', pageOptions);
    }
  }
  
  public getProjectCard(req: Request, res: Response, next: NextFunction) {
    const storage: SBI = new SBI();
    const ordersLogger: winston.LoggerInstance = storage.get('OrdersRoute').item();

    this.title = 'Список заказов | Anubis';

    const pageOptions: Object = {
      message: 'Проект 123test',
      isAuth: true,
      order: {
        name: '123test'
      }
    };


    try {
      ordersLogger.info('Get project card');
      this.render(req, res, "project-card.pug", pageOptions);
    } catch (e) {
      ordersLogger.error('Can not get project card');
      const error = new Error(e);
      next(error);
    }
  }
}
