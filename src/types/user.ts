export default class User {
    private isUnsafe: boolean;
    private name: string;
    private id: number;
    private referrer: string;
    private rule: string;
    private date: Date;
    private customerType: string;
    private error: string;
    /* Getters */
    public getName():string {
        return this.name;
    }
    public getIsUnsafe():boolean {
        return this.isUnsafe;
    }
    public getId():number {
        return this.id;
    }
    public getReferrer():string {
        return this.referrer;
    }
    public getRule():string {
        return this.rule;
    }
    public getTimestamp():Date {
        return this.date;
    }
    public getCustomerType():string {
        return this.customerType;
    }
    public getMe(): User {
        return this;
    }
    /* Setters */
    public setName(value: string):void {
        this.name = value;
    }
    public setIsUnsafe(value: boolean):void {
        this.isUnsafe = value;
    }
    public setId(value: number):void {
        this.id = value;
    }
    public setReferrer(value: string):void {
        this.referrer = value;
    }
    public setRule(value: string):void {
        this.rule = value;
    }
    public setTimestamp(value: string):void {
        this.date = new Date(Number(value));
    }
    public setCustomerType(value: string):void {
        this.customerType = value;
    }
    /* Constructor */
    constructor(obj){
        console.log(obj)
        this.setName(obj.username);
        this.setIsUnsafe(Boolean(obj.is_unsafe));
        this.setId(Number(obj.user_id));
        this.setReferrer(String(obj.referrer));
        this.setRule(String(obj.type));
        this.setTimestamp(obj.timestamp);
        this.setCustomerType(String(obj.customer_type));
    }
}
