declare type Rule = {
    required?: boolean;
    len?: number;
    max?: number | Date;
    min?: number | Date;
    type?: string;
    message?: string;
    validator?: (val: unknown) => string;
    transform?: (val: any) => any;
    pattern?: string | RegExp;
};
declare type Rules = Record<string, Rule[] | Rule>;
declare type Obj = Record<string, any>;
interface ValidateMessages {
    required: string;
    len: string;
    array: {
        type: string;
        between: string;
        max: string;
        min: string;
    };
    boolean: {
        type: string;
        required: string;
    };
    date: {
        type: string;
        max: string;
        min: string;
        between: string;
    };
    email: {
        type: string;
        max: string;
        min: string;
        len: string;
        between: string;
    };
    number: {
        type: string;
        max: string;
        min: string;
        between: string;
    };
    string: {
        type: string;
        len: string;
        max: string;
        min: string;
        between: string;
    };
    url: {
        type: string;
        len: string;
        max: string;
        min: string;
        between: string;
    };
}
interface ValidateOptions {
    messages: ValidateMessages;
}

declare class ProxyValidator {
    source: Obj;
    private _rules;
    private _validator;
    constructor(rules: Rules, refValue?: any, options?: ValidateOptions);
    get rules(): Rules;
    set rules(value: Rules);
    validate(fn: any): Promise<void>;
}

export { ProxyValidator as default };
