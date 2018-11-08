import DependenciesModel from './dependencies.model';

export default class ConfigProjectModel {
  public name: string;
  public description: string;
  public version: string;
  public dependencies: Array<DependenciesModel>;

  constructor(initResult: any) {
    this.name = initResult.name;
    this.description = initResult.description;
    this.version = initResult.version;
    if (initResult.dependencies) {
      this.dependencies = initResult.dependencies;
    } else {
      this.dependencies = new Array<DependenciesModel>();
    }
  }
}
