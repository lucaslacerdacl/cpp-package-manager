export default class InitModel {

  private _name: string;
  private _type: string;
  private _message: string;
  private _defaultName: string;
  private _validate: any;

  constructor(name: string, type: string, message: string, defaultName: string, validate?: Function) {
    this._name = name;
    this._type = type;
    this._message = message;
    this._defaultName = defaultName;
    this._validate = validate;
  }

  toObject(): Object {
    return {
      name: this._name,
      type: this._type,
      message: this._message,
      default: this._defaultName,
      validateInput: this._validate
    };
  }
}
