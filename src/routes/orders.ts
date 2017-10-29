import { IPage } from '../interfaces/page';
import { error, promisify } from 'util';
import OrdersUtils from '../modules/ordersUtils';
import { IOrder } from '../interfaces/order';
import { INestedUser } from '../interfaces/nestedUser';
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import SBI from 'sbi';
import { Model } from 'mongoose';
import { NestedUserSchema } from '../schemas/UserNested';
import { IPagination } from '../interfaces/pagination';
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
  
  public async getOrdersList(req: Request, res: Response, next: NextFunction): Promise<any> {
    try { 
      const storage: SBI = new SBI();
      const ordersUtils: OrdersUtils = new OrdersUtils(req);
      const promisifyActions: Array<any> = [ordersUtils.find('optimized'), ordersUtils.count()];


      const results: Array<any> = await Promise.all(promisifyActions);

      
      const ordersList: Object = (results[0]) ? results[0] : {};
      const ordersListLength: number = (results[1]) ? results[1] : 0; 
      

      this.title = 'Список заказов | Anubis';

      const currentPagination: IPagination = (<any>req).pagination;

      const pages: Array<IPage> = ordersUtils.getPagesObjectList(currentPagination, ordersListLength);
      
      const orders: Array<any> = (<any>ordersList).answer.data;
      console.log('ORDERS ', orders);
      const pageOptions: Object = {
        message: 'Выберите из списка',
        isAuth: true,
        orders,
        pages
      };

      this.render(req, res, 'orders.pug', pageOptions);
    } catch (e) {
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
    const ordersUtils: OrdersUtils = new OrdersUtils(req);
    
    const filters: Object = { name: req.params.name };

    ordersUtils.changeFilters(filters);
    
    this.title = 'Редактирвоание заказа(проекта) | Anubis';
    
    try {
      const findedData: Object = await ordersUtils.find('optimized');
      const findedOrder = (findedData 
                          && (<any>findedData).answer 
                          && (<any>findedData).answer.data 
                          && (<any>findedData).answer.data.length == 1) 
        ? (<any>findedData).answer.data[0]
        : undefined;  
      const pageOptions: Object = {
        message: 'Отредактируйте данные проекта',
        isAuth: true,
        isFind: (findedOrder) ? true : false,
        order: findedOrder || {}
      };     
      this.render(req, res, 'edit.pug', pageOptions);
    } catch (e) {
      const error = new Error(e);
      next(error);
    }
  }

  public async updateOrderEntry(req: Request, res: Response, next: NextFunction): Promise<any> {
    const ordersUtils: OrdersUtils = new OrdersUtils(req);

    try {
      const savedOrder: Object = await ordersUtils.updateOrder(req);
      const updatedDocument: Object = (<any>savedOrder).answer.data[0];
      const pageOptions: Object = {
        message: 'Редактивроание данных пользователя',
        isAuth: true,
        isFind: true,
        isUpdate: ((<any>savedOrder).error == 'undefined') ? true : undefined,
        isFailed: ((<any>savedOrder).error != 'undefined') ? true : undefined,
        order: updatedDocument
      };

      this.render(req, res, 'edit.pug', pageOptions);
    } catch (e) {
      const error = new Error(e);
      next(error);
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
