import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

export class LogoutRoute extends BaseRoute {

    public static create(router: Router) {
        console.log("[Baron::create] Creating logout router");
        router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
            new LogoutRoute().logout(req, res, next);
        });
    }

    constructor() {
        super();
    }

    public logout(req: Request, res: Response, next: NextFunction) {
        /* Check token */
        if(req.cookies.token) {
            res.clearCookie("token");
            res.redirect("/login");
        } else {
            res.redirect("/login");
        }
    }
}
