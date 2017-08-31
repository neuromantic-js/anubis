/**
 * The User for JWT
 *
 * @class Server
 */
export default class User {
    /**
     * Class variables
     */
    private isUnsafe: boolean;
    private name: string;
    private id: number;
    private referrer: string;
    private rule: string;
    private date: Date;
    /**
     * Assigning a variable "name" value
     * @class User
     * @method getName
     */
    public getName():string {
        return this.name;
    }
    /**
     * Assigning a variable "id" value
     * @class User
     * @method getId
     */
    public getId():number {
        return this.id;
    }
    /**
     * Assigning a variable "referrer" value
     * @class User
     * @method getReferrer
     */
    public getReferrer():string {
        return this.referrer;
    }
    /**
     * Assigning a variable "rule" value
     * @class User
     * @method getRule
     */
    public getRule():string {
        return this.rule;
    }
    /**
     * Assigning a variable "name" value
     * @class User
     * @method getName
     */
    public getMe(): User {
        return this;
    }
    /**
     * Assigning a variable "name" value
     * @class User
     * @method setName
     */
    public setName(value: string):void {
        this.name = value;
    }
    /**
     * Assigning a variable "id" value
     * @class User
     * @method setId
     */
    public setId(value: number):void {
        this.id = value;
    }
    /**
     * Assigning a variable "referrer" value
     * @class User
     * @method setReferrer
     */
    public setReferrer(value: string):void {
        this.referrer = value;
    }
    /**
     * Assigning a variable "rule" value
     * @class User
     * @method setRule
     */
    public setRule(value: string):void {
        this.rule = value;
    }
    /**
     * Constructor
     *
     * @class User
     * @constructor
     */
    constructor(obj){
        this.setName(obj.username);
        this.setId(Number(obj.user_id));
        this.setReferrer(String(obj.referrer));
        this.setRule(String(obj.type));
    }
}
