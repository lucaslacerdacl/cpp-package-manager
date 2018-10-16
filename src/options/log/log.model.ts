export default class LogModel {

  error: any;
  readonly date: Date;

  constructor(error: any) {
    this.error = error;
    this.date = new Date();
  }

}
