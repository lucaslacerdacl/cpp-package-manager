export default class InitRespondeModel {
  public name: string;
  public description: string;
  public dependencies: Array<any>;

  constructor(initResult: any) {
    this.name = initResult.name;
    this.description = initResult.description;
    this.dependencies = new Array<any>();
  }
}