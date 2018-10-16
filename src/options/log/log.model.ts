export default class LogModel {

  error: any;
  readonly date: Date;

  constructor(error: any) {
    this.error = error;
    this.date = new Date();
    this.date.setMilliseconds(0);
    this.date.setSeconds(0);
  }

}
