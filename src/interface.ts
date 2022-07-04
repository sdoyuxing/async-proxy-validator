export type Rule = {
  required?: boolean;
  len?: number;
  max?: number | Date;
  min?: number | Date;
  type?: string;
  message?: string;
  validator?: (val: unknown) => string;
};
export type Rules = Record<string, Rule[]|Rule>;
export type Obj = Record<string, any>;
export type initType = String | Number | Obj | null;
export interface ValidateType {
  error: string[];
  validate: () => boolean;
  validateTypes: () => void;
  validateRequired: () => void;
}
export type internalType =
  | "number"
  | "boolean"
  | "array"
  | "string"
  | "date"
  | "url"
  | "email";
  
export interface ValidateMessages {
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
export interface ValidateOptions {
  messages: ValidateMessages;
}
