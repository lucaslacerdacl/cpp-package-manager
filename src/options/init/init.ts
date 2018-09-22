import Inquirer from "../../lib/inquirer";
import InitRespondeModel from "./init-response.model";

export default class Init {
  private inquirer: Inquirer = new Inquirer();

  private FormatInitResponde(initResult): InitRespondeModel {
    const response = new InitRespondeModel(initResult.name);
    return response;
  }

  constructor() {
    this.inquirer.AskInitDetails()
      .then((initResult) => {
        const result = this.FormatInitResponde(initResult);
        console.log(result.getName());
      });
  }
}