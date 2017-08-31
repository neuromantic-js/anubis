/**
 * JSON web token decode middleware
 */
import * as express from "express";
import jwt = require("jsonwebtoken");
import User from "../types/user";
/**
 * Main constants
 */
const secretWord = "052lrWngfxVv";
const decodeToken = (token: string): Promise<User> => {
    /* Return promise */
    return new Promise<User>((resolve, reject) => {
        /* Try decode token */
        jwt.verify(token, secretWord, (error, decoded) => {
            console.log("DECODED: ", decoded)
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
/*
 * Middleware function as const
 */
export default class JWTMiddleware {
    /* Constructor */
    constructor() {}
    /**
     * Method for access without decode
     *
     * @class JWTMiddleware
     * @method withoutDecode
     */
    withoutDecode(req: express.Request, res: express.Response, next: express.NextFunction): void {
        next();
    }
    /**
     * Method for only decode token
     *
     * @class JWTMiddleware
     * @method onlyDecode
     */
    onlyDecode(req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Try get token */
        const token = getTokenString(req);
        /* Check token */
        if(token != "empty") {
            /* Try decode token */
            decodeToken(token)
                .then(user => {
                    next();
                })
                .catch(error => {
                    /* TODO add error handler */
                    throw error;
                });

        } else {
            /* If token not send
             * TODO add to error handler */
            res.redirect("/login");
        }
    }
    /**
     * Method for decode and write to request
     *
     * @class JWTMiddleware
     * @mathod decodeAndWrite
     */
    decodeAndWriter(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log("DECODE TOKEN !!!");
        /* Try get token */
        const token = getTokenString(req);
        /* Check token */
        if(token != "empty") {
            /* Try decode token */
            decodeToken(token)
                .then(user => {
                    /* Add user to request */
                    req.body.decoded = user;
                    next();
                })
                .catch(error => {
                    console.log("THIS");
                    res.redirect("/login");
                });
        } else {
            /* If token not set */
            res.redirect("/login");
        }
    }
}
