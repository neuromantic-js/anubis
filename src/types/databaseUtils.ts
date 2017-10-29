import { Request } from 'express';
import SBI from 'sbi';
import ObjectToAnswer from '../types/objectToAnswer';


export default class DatabaseUtils {
  private _storage: SBI;
  private _filters: Object;
  private _currentModel: any;
  private _limit: number;
  private _sort: any;
  private _skip: number;
  private _apiVersion: string;
  private _author: any;
  private _client: string;
  
  /* Constructor */
  constructor(req: Request, model: string) {
    /* Set storage */
    this.storage = new SBI();
    /* Set filters */
    this.filters = (<any>req).filters;
    /* Set model from storage */
    this.currentModel = model;
    /* Set pagination data (limit, sort, skip) */
    this.setPagination(req);
    /* Set client */
    this.client = (<any>req).referrer;
    /* Set user */
    // TODO change on auth
    this.author = (<any>req).referrer;
    /* Set api version */
    this.apiVersion = (<any>req).apiVersion;
  }
  
  /* OPEN API FOR OTHER OBJECT
   * change filters in object */
  public changeFilters(filters: object): void {
    this.filters = filters;
  }
  /* Get one entry current model */
  public async findOne(state: string, filter: object): Promise<any> {
    try {
      /* Empty answer var*/
      let answer: Array<any>;
      /* Check state */
      if (state != 'optimized') {
        answer = await this.currentModel
          .findOne(filter);
      } else {
        answer = await this.currentModel
          .findOne(filter)
          .lean();
      }
      /* Create object to answer */
      const objectToAnswer: ObjectToAnswer = new ObjectToAnswer(undefined, 200, answer,  undefined, undefined, undefined);
      /* Create object to return */
      const objectToReturn: Object = objectToAnswer.answerAfterFind();
      /* Return object to return */
      return objectToReturn;
    } catch (error) {
      /* Craete object to answer */
      const objectToAnswer: ObjectToAnswer = new ObjectToAnswer(error, 510, undefined, this.limit, this.skip, this.sort);
      /* Create object to return */
      const objectToReturn: Object = objectToAnswer.answerMongooseError();
      /* Return error */
    }
  }
  /* Get list entries current model */
  public async find(state: string): Promise<any> {
    try {
      console.log(this.filters)
      /* Set empty variablie */
      let answer: Array<any>;
      /* Check state & pagination */
      if (state == 'optimized' && this.limit == -1) {
        answer = await this.currentModel
          .find(this.filters)
          .skip(this.skip)
          .sort(this.sort)
          .lean();
      } else if (state === 'full' && this.limit == -1) {
        answer = await this.currentModel
          .find(this.filters)
          .skip(this.skip)
          .sort(this.sort);
      } else if (state == 'optimizied' && this.limit != -1) {
        answer = await this.currentModel
          .find(this.filters)
          .skip(this.skip)
          .limit(this.limit)
          .sort(this.sort)
          .lean();
      } else if (state == 'full' && this.limit != -1) {
        answer = await this.currentModel
          .find(this.filters)
          .skip(this.skip)
          .limit(this.limit)
          .sort(this.sort);
      } else {
        answer = await this.currentModel.find(this.filters);
      }
      /* Create object to answer */
      const objectToAnswer: ObjectToAnswer = new ObjectToAnswer(undefined, 200, answer, this.limit, this.skip, this.sort);
      /* Create object to return */
      const objectToReturn: Object = objectToAnswer.answerAfterFind();
      /* Return object */
      return objectToReturn;
    } catch (error) {
      /* Create object to answer */
      const objectToAnswer: ObjectToAnswer = new ObjectToAnswer(error, 501, undefined, this.limit, this.skip, this.sort);
      /* Crraete object to return */
      const objectToReturn: Object = objectToAnswer.answerMongooseError();
      /* Return object to return */
      return objectToReturn;
    }
  }
  /* Find object & update entries */
  public async findAndUpdate(body: object): Promise<any> {
    try {
      /* Get fineded object */
      const findedEntries = await this.find('full');
      /* Set empty variables */
      let objectToAnswer: ObjectToAnswer;
      let objectToReturn: Object;
      
      /* Get answer */
      let answer = (<any>findedEntries).answer;
      /* Check data length */
      if (answer.data.length == 0) {
        /* Answer, when arrays is empty */
        objectToAnswer = new ObjectToAnswer(undefined, 404, answer.data, this.limit, this.skip, this.sort);
        /* Create object to return */
        objectToReturn = objectToAnswer.answerAfterSave();
      } else {
        /* Get schema keys */
        const schemaKeys: Array<string> = Object.keys((<any>this.currentModel).schema.obj);
        /* Get body keys */
        const bodyKeys: Array<string> = Object.keys(body);
        
        /* Get obect to update */
        const objectToUpdate = answer.data[0];
        /* UPdate fields */
        for (let key of bodyKeys) {
          if (schemaKeys.indexOf(key) != -1) {
            objectToUpdate[key] = body[key];
          }
        }
        /* Try save */
        const savedData = await objectToUpdate.save();
        
        /* Create object to answer */
        objectToAnswer = new ObjectToAnswer(undefined, 201, savedData, undefined, undefined, undefined);
        /* Create object to return */
        objectToReturn = objectToAnswer.answerAfterSave();
        /* Return answer */
        return objectToReturn;
        
      }
      /* Return object */
      return objectToAnswer;
    } catch (error) {
      /* Create object to answer with error */
      const objectToAnswer: ObjectToAnswer = new ObjectToAnswer(error, 501, undefined, this.limit, this.skip, this.sort);
      /* Create object to return */
      const objectToReturn: Object = objectToAnswer.answerMongooseError();
      /* Return object */
      return objectToReturn;
    }
  }
  /* Find entry or create from body */
  public async findOrCreate(newObject: any): Promise<any> {
    try {
      /* Get finded object */
      const findedEntries = await this.find('full');
      /* Set empty object */
      let objectToAnswer: ObjectToAnswer;
      let objectToReturn: Object;
      /* Get answer object */
      let answer = (<any>findedEntries).answer;
      /* Length data */
      if (answer.data.length == 0) {
        /* Set guid */
        const guid = (<any>this.filters).guid;
        /* Create new object */
        const objectToCreate = newObject;
        /* Get current model */
        const currentModel = this.currentModel;
        /* Craete new model */
        const documentToSave = new currentModel(objectToCreate);
        /* Save model */
        const savedModel = await documentToSave.save();
        /* Get tools to build answer */
        objectToAnswer = new ObjectToAnswer(undefined, 201, savedModel, undefined, undefined, undefined);
        /* Create object to return */
        objectToReturn = objectToAnswer.answerAfterSave();
        /* Return answer */
        return objectToReturn;
      } else {
        objectToAnswer = new ObjectToAnswer(undefined, 200, answer.data, undefined, undefined, undefined);
        objectToReturn = objectToAnswer.answerAfterSave();
      }
      /* Return object */
      return objectToReturn;
    } catch (error) {
      /* Return error */
      const objectToAnswer: ObjectToAnswer = new ObjectToAnswer(error, 501, undefined, this.limit, this.skip, this.sort);
      const objectToReturn: Object = objectToAnswer.answerMongooseError();
      /* Return object */
      return objectToReturn;
    }
  }
  
  
  public async count(): Promise<any> {
    try {
        const count: number = await this.currentModel.count();
        return count;
    } catch (error) {
        return error;
    }
  }
  
  set author(author: any) {
    this._author = author;
  }
  set storage(storage: SBI) {
    this._storage = storage;
  }
  set apiVersion(version: string) {
    this._apiVersion = version;
  }
  set currentModel(model: any) {
    /* Get all models */
    const models = this.storage.get('model').item();
    /* Set current model from object */
    this._currentModel = (<any>models)[model];
  }
  /* Set referrer from request */
  set client(client: string) {
    this._client = client;
    //this._client = (<any>req).referrer;
  }
  /* Set filters from request */
  set filters(filters: object) {
    this._filters = filters;
    //this._filters = (<any>req).filters;
  }
  set limit(limit: number) {
    this._limit = limit;
  }
  set skip(skip: number) {
    this._skip = skip;
  }
  set sort(sort: any) {
    this._sort = sort;
  }
  /* Set limit */
  private setPagination(req: Request) {
    /* Set default pagination object */
    const defaultObject: Object = {
      limit: 10,
      skip: 0,
      sort: {}
    };
    /* Check request & set pagination */
    const pagination: Object = ((<any>req).pagination) ? (<any>req).pagination : defaultObject;
    /* Set limit from pagination object */
    this.limit = (<any>pagination).limit;
    /* Set skip from pagination object */
    this.skip = (<any>pagination).skip;
    /* Set sort from pagination object */
    this.sort = (<any>pagination).sort;
  }
  
  /* GETTERS
   * get author from object */
  get author(): any {
    return this._author;
  }
  /* Get storage from */
  get storage(): SBI {
    return this._storage;
  }
  /* Get API version from object */
  get apiVersion(): string {
    return this._apiVersion;
  }
  /* Get current model from object*/
  get currentModel(): any {
    return this._currentModel;
  }
  /* Get client from object */
  get client(): string {
    return this._client;
  }
  /* Get filters from object */
  get filters(): object {
    return this._filters;
  }
  /* Get limit */
  get limit(): number {
    return this._limit;
  }
  /* Get skip */
  get skip(): number {
    return this._skip;
  }
  /* Get sort */
  get sort(): any {
    return this._sort;
  }
}
