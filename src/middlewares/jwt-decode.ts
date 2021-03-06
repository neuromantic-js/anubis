/**
 * JSON web token decode middleware
 */
import * as express from "express";
import jwt = require("jsonwebtoken");
import User from "../types/user";
import config from "../../configs/config";
import Logger from "../modules/logger";
/**
 * Main constants
 */
const secretWord: string = String(config.jwt.salt);
const decodeToken = (token: string): Promise<User> => {
  /* Return promise */
  return new Promise<User>((resolve, reject) => {
    /* Try decode token */
    jwt.verify(token, secretWord, (error, decoded) => {
      /* Check returned value */
      if(error !== null) {
          /* Return error */
          reject(new User(error));
      } else {
          /* Return value */
          resolve(new User(decoded));
      }
    });
  });
};
const getTokenString = (req: express.Request): string => {
    /* Set empty token */
    let token = undefined;
    /* Check headers */
    if(req.headers.hasOwnProperty("token")) {

        token = req.headers.token;
    } else {
        /* Chec cookies */
        if(req.cookies.hasOwnProperty("token")) {
            token = req.cookies.token;
        } else {
            /* Check method */
            if(req.method === "GET") {
                /* Get from query */
                token = req.query.token;
            } else {
                /* Get from body */
                token = req.body.token;
            }
        }
    }
    if(token == undefined) {
        token = "empty";
    }
    /* Return token */
    return String(token);
};
/**
 * @export
 * @class JWTMiddleware
 */
export default class JWTMiddleware {
    private logger: Logger;

    constructor() {
        /* Set logger options */
        const options = {
            "path": "middlewares.JWTMiddleware"
        };
        this.logger = new Logger(options);
    }
    /**
     * Method for access without decode
     *
     * @class JWTMiddleware
     * @method withoutDecode
     * @param req {Request} The express request object
     * @param res {Response} The express response object
     * @next {NextFunction} Execute the next method
     */
    public withoutDecode(req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Add auth object to request */
        Object.defineProperty(req, "auth", {
            value: "without-control",
            writable: false,
            configurable: false
        });
        next();
    }
    /**
     * Method for only decode token
     *
     * @class JWTMiddleware
     * @method onlyDecode
     * @param req {Request} The express request object
     * @param res {Response} The express response object
     * @next {NextFunction} Execute the next method
     */
    public onlyDecode(req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Try get token */
        const token = getTokenString(req);
        /* Check token */
        if(token != "empty") {
            /* Try decode token */
            decodeToken(token)
                .then(user => {
                    next();
                })
                .catch(err => {
                  const error = new Error(err);
                  next(error);
                });

        } else {
            this.logger.console("warn", "Not send token");
            const error = new Error("Unauthorized");
            next(error);
        }
    }
    /**
     * Method for decode and write to request
     *
     * @class JWTMiddleware
     * @mathod decodeAndWrite
     * param req {Request} The express request object
     * @param res {Response} The express response object
     * @next {NextFunction} Execute the next method
     */
    decodeAndWriter(req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Try get token */
        const token = getTokenString(req);
        /* Check token */
        if(token != "empty") {
            /* Try decode token */
            decodeToken(token)
                .then(user => {
                    /* Add auth object to request */
                    Object.defineProperty(req, "auth", {
                        value: user,
                        writable: false,
                        configurable: false
                    });
                    next();
                })
                .catch(error => {
                    res.redirect("/login");
                });
        } else {
            /* If token not set */
            res.redirect("/login");
        }
    }
}
