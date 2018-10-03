import DependenciesModel from './dependencies.model';

export default class ConfigFileModel {
  public name: string;
  public description: string;
  public version: string;
  public dependencies: Array<DependenciesModel>;

  constructor(initResult: any) {
    this.name = initResult.name;
    this.description = initResult.description;
    this.version = initResult.version;
    this.dependencies = new Array<DependenciesModel>();
  }
}
