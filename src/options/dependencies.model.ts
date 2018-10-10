export default class DependenciesModel {
  name: string;
  url: string;

  constructor(name?: string, url?: string) {
    if (name) {
      this.name = name;
    }

    if (url) {
      this.url = url;
    }
  }
}
