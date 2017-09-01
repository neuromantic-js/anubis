import * as express from "express";
import config from "../../configs/config";
import Logger from "../modules/logger";
/**
 * Logger for all erros
 *
 * @class logErrors
 */
export default class logErrors {
    public logger: Logger;
    /**
     * Constructor
     *
     * @class logErrors
     * @constructor
     */
    constructor() {}

    private setLogger():void {
        /* Set logger options */
        const options: Object = {
            "path": "mongoose.connection"
        };
        this.logger = new Logger(options);
    }
    /**
     * Method for log only errors
     *
     * @class logErrors
     * @method withoutDecode
     * @param error {any} Any error object
     * @param req {Request} Express request object
     * @param res {Response} Express response object
     */
    public onlyError(error: any, req: express.Request, res: express.Response, next: express.NextFunction): void {
        /* Set status code variable  */
        let statusCode: number;
        let message: string;
        let debug: string;
        /* Set status code variable */
        switch(error.message) {
        case "BadRequest":
            statusCode = 401;
            message = "Bad request";
            break;
        case "Unauthorized":
            statusCode = 401;
            message = "Access denied! Not authorized user";
            break;
        case "PaymentRequired":
            statusCode = 402;
            message = "Access denied! Payment required";
            break;
        case "Forbidden":
            statusCode = 403;
            message = "Request forbidden";
            break;
        case "NotFound":
            statusCode = 403;
            message = "Object not found";
            break;
        case "MethodNotAllowed":
            statusCode = 405;
            message = "Method Not Allowed";
            break;
        case "NotAcceptable":
            statusCode = 406;
            message = "Not acceptable request";
            break;
        case "ProxyAuthenticationRequired":
            statusCode = 407;
            message = "Required proxy authentication";
            break;
        case "RequestTimeout":
            statusCode = 408;
            message = "Request timeout";
            break;
        case "Conflict":
            statusCode = 409;
            message = "Some conflict";
            break;
        case "Gone":
            statusCode = 410;
            message = "Object is gone";
            break;
        case "LengthRequired":
            statusCode = 411;
            message = "Length required";
            break;
        case "PreconditionFailed":
            statusCode = 412;
            message = "Precondition Failed"
            break;
        case "PayloadTooLarge":
            statusCode = 413;
            message = "Payload Too Large";
            break;
        case "UriToLong":
            statusCode = 414;
            message = "URI Too Long";
            break;
        case "Unsupported Media Type":
            statusCode = 415;
            message = "Unsupported Media Type";
            break;
        case "RangeNotSatisfiable":
            statusCode = 416;
            message = "Range Not Satisfiable";
            break;
        case "ExpectationFailed":
            statusCode = 417;
            message = "Expectation Failed";
            break;
        case "IamTeaport":
            statusCode = 418;
            message = "I’m a teapot";
            break;
        case "Unprocessable Entity":
            statusCode = 422;
            message = "Unprocessable Entity";
            break;
        case "Locked":
            statusCode = 423;
            message = "Locked";
            break;
        case "Failed Dependency":
            statusCode = 424;
            message = "Failed Dependency";
            break;
        case "Unordered Collection":
            statusCode = 425;
            message ="Unordered Collection";
            break;
        case "Upgrade Required":
            statusCode = 426;
            message = "Upgrade Required";
            break;
        case "Precondition Required":
            statusCode = 428;
            message = "Precondition Required";
            break;
        case "TooManyRequests":
            statusCode = 429;
            message = "Too Many Requests";
            break;
        case "RequestHeaderFieldsTooLarge":
            statusCode = 431;
            message = "Request Header Fields Too Large";
            break;
        case "BoodooPeople":
            statusCode = 444;
            message = "Boodoo People";
            break;
        case "RetryWith":
            statusCode = 449;
            message ="Retry With";
            break;
        case "UnavailableForLegalReasons":
            statusCode = 451;
            message = "Unavailable For Legal Reasons";
            break;
        case "InternalServerError":
            statusCode = 500;
            message = "InternalServerError";
            break;
        case "NotImplemented":
            statusCode = 501;
            message = "Not Implemented";
            break;
        case "BadGateway":
            statusCode = 502;
            message = "Bad Gateway";
            break;
        case "ServiceUnavailable":
            statusCode =  503;
            message = "Service Unavailable";
            break;
        case "GatewayTimeout":
            statusCode = 504;
            message = "Gateway Timeout";
            break;
        case "NotSupported":
            statusCode = 505;
            message = "HTTP Version Not Supported";
            break;
        case "VariantNegotiates":
            statusCode = 506;
            message = "Variant Also Negotiates";
            break;
        case "Insufficient Storage":
            statusCode = 507;
            message = "Insufficient Storage";
        case "LoopDetected":
            statusCode = 508;
            message = "Loop Detected";
            break;
        case "BandwidthLimitExceeded":
            statusCode = 509;
            message = "Bandwidth Limit Exceeded";
            break;
        case "NotExtended":
            statusCode = 510;
            message = "Not Extended";
            break;
        case "NetworkAuthenticationRequired":
            statusCode = 511;
            message = "Network Authentication Required";
            break;
        case "UnknownError":
            statusCode = 520;
            message = "Unknown Error";
            break;
        case "Dead":
            statusCode = 521;
            message = "Web Server Is Down";
            break;
        case "ConnectionTimedOut":
            statusCode = 522;
            message = "Connection Timed Out";
            break;
        case "OriginUnreachable":
            statusCode = 523;
            message = "Origin Is Unreachable";
            break;
        case "TimeoutOccurred":
            statusCode = 524;
            message = "A Timeout Occurred";
            break;
        case "SslHandshakeFailed":
            statusCode = 525;
            message = "SSL Handshake Failed";
            break;
        case "InvalidSslCertificate":
            statusCode = 526;
            message = "Invalid SSL Certificate";
            break;
        default:
            statusCode = 520;
            message = "Unknown Error";
            break;
        }
        /* Check error stack */
        debug = (error.stack)
            ? error.stack
            : "Information from the debugger is not present"
        const errorDate = new Date();
        /* Create answer object */
        const answerObject: Object = {
            "data": [],
            "error": message,
            "meta": {
                "code": statusCode,
                "message": message,
                "stacktrace": debug,
                "date": errorDate
            }
        };
        /* Create error string */
        const answerString: string = `[${errorDate}::${statusCode}] [${message}] >> ${debug}`;
        /* Get answer type */
        const answerType = config.logger.type;
        /* Set logge settings */
        const loggerSettings = config.logger;
        /* Create logger options  */
        const options: Object = {
            "path": "mongoose.connection"
        };
        /* Create logger object */
        const logger = new Logger(options);
        /* Check logger output */
        if(loggerSettings.console == true) {
            logger.console("info", answerString);
        }
        /* Check type */
        if(answerType == "json") {
            /* Return JSON answer */
            res.status(statusCode).json(answerObject);
        } else {
            /* Return render page (default) */
            res.status(statusCode).render(answerString);
        }
    }
}
