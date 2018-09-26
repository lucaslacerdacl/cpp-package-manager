export default class LogModel {
  error: any;
  private date: Date;

  constructor(error: any) {
    this.error = error;
    this.date = new Date();
  }
}