import * as express from "express";
/**
 * @export
 * @class AccessControl
 */
export default class AccessControl {
    private roles: Array<string>;
    /**
     * Creates an instance of AccessControl.
     * 
     * @memberOf AccessControl
     */
    constructor() {}
    /**
     * Set roles to access contro;
     * @param {Array<string>} values 
     * 
     * @memberOf AccessControl
     */
    public setRoles(values: Array<string>): void {
        this.roles = values;
    }
    /**
     * Check access bu req param
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * 
     * @memberOf AccessControl
     */
    public checkAccess(req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Check auth value in request object */
        const auth:any = (<any>req).auth;
        /* Set access var */ 
        let access = false;
        /* Check */
        if(typeof auth == "string") {
            access = (auth == "without-control")
                ? true
                : false;    
        } else {
            access = (this.roles.indexOf(auth.type) != -1)
                ? true
                : false;
        }
        /* Check access */
        if(access) {
            next();
        } else {
            const error = new Error("Unauthorized");
            next(error);
        }
    }
}