import Inquirer from "../../lib/inquirer";
import InitRespondeModel from "./init-response.model";

export default class Init {
  private inquirer: Inquirer = new Inquirer();

  constructor() {
    this.inquirer.AskInitDetails()
      .then((initResult: InitRespondeModel) => {
        console.log(initResult.name);
        console.log(initResult.description);
      });
  }
}