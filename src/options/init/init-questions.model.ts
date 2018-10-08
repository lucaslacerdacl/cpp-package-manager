export default class InitModel {

  private _name: string;
  private _type: string;
  private _message: string;
  private _defaultValue: string;

  constructor(name: string, type: string, message: string, defaultValue: string) {
    this._name = name;
    this._type = type;
    this._message = message;
    this._defaultValue = defaultValue;
  }

  toObject(): Object {
    return {
      name: this._name,
      type: this._type,
      message: this._message,
      default: this._defaultValue
    };
  }
}
