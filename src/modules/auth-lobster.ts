import * as express from "express";
import jwt = require("jsonwebtoken");
import User from "../types/user";
import AuthData from "../types/authData";
import rp = require("request-promise");

const loginLobsterUrl = "https://auth.itlabs.io/api/development/login";

export default class AuthLobster {
    uri: string;
    method: string;
    json: boolean;
    body: any;
    /* Getters */
    public getOptions(): AuthLobster {
        return this;
    }
    /* Setteres */
    private setMethod(value: string): void {
        this.method = value;
    }
    private setLobsterUrl(value: string): void {
        this.uri = value;
    }
    private setJson(value: boolean): void {
        this.json = value;
    }
    private setBody(value: any): void {
        this.body = value;
    }
    /* Constructor */
    constructor(obj) {
        this.setLobsterUrl(String(loginLobsterUrl));
        this.setMethod("POST");
        this.setJson(true);
        /* Crete object with options */
        let body = {
            "username": obj.login,
            "password": obj.password,
            "referrer": obj.referrer
        };
        /* Add options */
        this.setBody(body);
        return this;
    }
    /* Auth in service */
    public login(obj): Promise<any> {
        /* Return promise */
        return new Promise<any>((resolve, reject) => {
            /* Set constant */
            const options = this.getOptions();
            const requestBody = obj;
            /* Request new promise */
            rp(this)
                .then(answer => {
                    /* Resolve answer */
                    resolve(answer);
                })
                .catch(error => {
                    /* Reject answer */
                    reject(error);
                });
        });
    }
}
