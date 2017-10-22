import winston = require('winston');

export default class CWOptions {
    private _level: string;
    private _colorized: boolean;
    private _label: string;
    private _transport: Array<winston.TransportInstance>;

    constructor(obj: Object) {
        if (obj.hasOwnProperty('level')) {
            this.level = obj['level'];
        }

        if (obj.hasOwnProperty('colorized')) {
            this.colorized = obj['colorized'];
        }

        if (obj.hasOwnProperty('label')) {
            this.label = obj['label'];
        }
        const transport: Array<winston.TransportInstance> = [new (winston.Transport)()];
        this.transport = transport;
        return this;
    }

    set level(lvl: string) {
        this._level = lvl;
    }
    set colorized(cld: boolean) {
        this._colorized = cld;
    }
    set label(lbl: string) {
        this._label = lbl;
    }
    set transport(transport: Array<winston.TransportInstance>) {
        this._transport = transport;
    }

    get level(): string {
        return this._level;
    }
    get colorized(): boolean {
        return this._colorized;
    }
    get label(): string {
        return this._label;
    }
    get transport(): Array<winston.TransportInstance> {
        return this._transport;
    }
}
