export default class ObjectToAnswer {
  private _status: string;
  private _error: any;
  private _code: number;
  private _data: Array<any>;
  private _count: number;
  private _version: string;
  private _limit: number;
  private _skip: number;
  private _sort: any;
  
  set status(status: string) {
    this._status = status;
  }
  set error(error: any) {
    this._error = error;
  }
  set code(code: number) {
    this._code = code;
  }
  set data(data: Array<any>) {
    this._data = data;
  }
  set count(count: number) {
    this._count = count;
  }
  set version(version: string) {
    this._version = version;
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
  get status(): string {
    return this._status;
  }
  get error(): any {
    return this._error;
  }
  get code(): number {
    return this._code;
  }
  get data(): Array<any> {
    return this._data;
  }
  get count(): number {
    return this._count;
  }
  get version(): string {
    return this._version;
  }
  get limit(): number {
    return this._limit;
  }
  get skip(): number {
    return this._skip;
  }
  get sort(): any {
    return this._sort;
  }
  
  constructor(error: any, code: number, data: any, limit: number, skip: number, sort: any) {
    this.status = (error) ? 'failed' : 'success';
    this.error = error;
    this.code = code;
    this.data = (Array.isArray(data)) ? data : [data];
    this.count = this.data.length || 0;
    this.version = 'current';
    this.limit = limit;
    this.skip = skip;
    this.sort = sort;
  }
  
  public answerAfterSave(): Object {
    /* Set data */
    const data = this.data;
    /* Create object to return */
    const objectToReturn: Object = {
      status: this.status,
      error: 'undefined',
      answer: {
        code: 201,
        data: data
      }
    };
    /* Return answer */
    return objectToReturn;
  }
  
  public answerAfterFind(): Object {
    /* Set data */
    const data = this.data;
    /* Create object to return */
    const objectToReturn: Object = {
      status: this.status,
      error: 'undefined',
      answer: {
        code: (data.length == 0) ? 404 : 200,
        data: data,
        meta: {
          count: data.length,
          version: this.version,
          pagination: {
            limit: this.limit,
            skip: this.skip + data.length,
            sort: this.sort
          }
        }
      }
    };
    /* Return object */
    return objectToReturn;
  };
  
  public answerMongooseError(): Object {
    const error = this.error;
    const objectToReturn: Object = {
      status: this.status,
      error: new Error(error),
      answer: undefined
    };
    /* Return object */
    return objectToReturn;
  }
}
