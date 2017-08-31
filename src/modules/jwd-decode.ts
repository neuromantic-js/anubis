import * as express from "express";
import jwt = require("jsonwebtoken");
import User from "../types/user";

const secretWord = "052lrWngfxVv";
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
