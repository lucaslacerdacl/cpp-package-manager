export default class ConfigBuildModel {
  public fileName: string;
  public binaries: Array<string>;

  constructor(configBuildFile: any) {
    this.fileName = !configBuildFile.fileName || configBuildFile.fileName === '' ? 'main' : configBuildFile.fileName;
    this.binaries = configBuildFile.binaries;
  }
}
