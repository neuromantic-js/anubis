import * as server from './applicationServer';
import * as http from 'http';
/**
 * @class BaronServer
 */
export default class BaronServer {
  private httpPort: any;
  private applicatoins: Object;
  private httpServer: Object;
  private tasks: Array<string>;

  /**
   * Constructor Baron Samedi server
   *
   * @param {Array<string>} value Array with task for running server
   */
  constructor(value: Array<string>) {
    /* Set tasks */
    this.setTasks(value);
    /* & set iterator & run task */
    for(let iterator of value) {
      this.runTask(iterator);
    }
  }

  /**
   * Method for run one task from constructor
   *
   * @method runTask
   * @param {string} task String with name of task
   * @memberOf BaronServer
   * @return {void}
   */
  private runTask(task: string): void {
    /* Check task */
    switch (task) {
      case "http":
        this.createHttpServer();
        break;
      default:
        this.createHttpServer();
        break;
    }
  }

  /**
   * Method to set task in Baron instance
   *
   * @method setTask
   * @param {Array<string>} value
   * @memberOf BaronServer
   * @return {void}
   */
  private setTasks(value: Array<string>) {
    this.tasks = value;
  }

  /**
   * Constructor for http-server
   *
   * @method createHttpServer
   * @memberOf BaronServer
   * @return {void}
   */
  private createHttpServer() {
    /* Set application port */
    this.setHttpPort(process.env.PORT || 8080);
    /* Create application server */
    this.setApplication(server.Server.bootstrap().app);
    /* Set application server port */
    this.setHttpApplicationPort(this.httpPort);
    /* Set server */
    this.setHttpServer(this.applicatoins);
    (<any>this.httpServer).listen(this.httpPort);
    (<any>this.httpServer).on("error", this.onError);
    (<any>this.httpServer).on("listening", this.onLister);
  }

  /**
   * Create http-server
   *
   * @method setHttpServer
   * @param {any} value
   * @memberOf BaronServer
   * @return {void}
   */
  private setHttpServer(value: any): void {
    this.httpServer = http.createServer(value);
  }

  /**
   * Method for set HTTP-port for Baron instance
   *
   * @method setHttpPort
   * @param {any} value
   * @return {void}
   */
  private setHttpPort(value: any): void {
    this.httpPort = this.normalizePort(value);
  }

  /**
   * Set appilcation instance
   *
   * @method setApplication
   * @param {Object} value
   * @memberOf BaronServer
   * @return {void}
   */
  private setApplication(value: Object): void {
    this.applicatoins = value;
  }

  /**
   * Set port for applications Express instance
   *
   * @method setHttpApplicationPort
   * @param {any} value
   * @memberOf BaronServer
   * @return {void}
   */
  private setHttpApplicationPort(value: any): void {
    (<any>this.applicatoins).set("port", value);
  }

  /**
   * Normalize port & return value
   *
   * @method normalizePort
   * @param value
   * @memberOf BaronServer
   * @return {any}
   */
  private normalizePort(value:any):any {
    /* Set port constant */
    const port:number = parseInt(value, 10);
    /* Set empty variable */
    let returnedPort: any;
    /* Check & set port to return */
    if(isNaN(port)) {
      returnedPort = value;
    } else if(port >= 0) {
      returnedPort = port;
    }  else {
      returnedPort = false;
    }
    /* Return port value */
    return returnedPort;
  }

  /**
   * Method for listen events
   *
   * @method onLister
   * @memberOf BaronServer
   * @return {void}
   */
  private onLister(): void {
    const addr = (<any>this).address();
    const bind = typeof addr === "string"
        ? `pipe ${addr}`
        : `port ${addr.port}`;
  }

  /**
   * Method for work with event loop
   *
   * @method onError
   * @memberOf BaronServer
   * @param error
   * @return {void}
   */
  private onError(error: any): void {
    /* Check error syscall */
    if (error.syscall != "listen") throw error;
    /* Set bond */
    const bind = (typeof this.httpPort == "string")
        ? "Pipe " + this.httpPort
        : "Port " + this.httpPort;
    /* Set error code */
    const code = error.code;
      switch (code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
  }

}



