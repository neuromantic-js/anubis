export default class AuthData {
    private login: string;
    private password: string;
    private referrer: string;
    /* Getters */
    public getMe() {
        return this;
    }
    /* Setters */
    private setLogin(login: string): void {
        this.login = login;
    }
    private setPassword(password: string): void {
        this.password = password;
    }
    private setReferrer(referrer: string): void {
        this.referrer = referrer;
    }
    /* Constructor */
    constructor(obj) {
        this.setLogin(obj.username);
        this.setPassword(obj.password);
        this.setReferrer("sdvor");
        return this;
    }
}
