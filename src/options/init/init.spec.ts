import { stub, SinonStub } from 'sinon';
import * as inquirer from 'inquirer';
import Init from './init';
import { expect } from 'chai';
import * as fs from 'fs';
import InitModel from './init-questions.model';
import * as path from 'path';

describe('Init method', () => {

  let stubFS: SinonStub;
  let stubInquirer: SinonStub;

  before(() => {
    stubFS = stub(fs, 'readdirSync');
    stubInquirer = stub(inquirer, 'prompt');
  });

  afterEach(() => {
    stubFS.reset();
  });

  it('should check and advise if the configuration file already exists', () => {
    const stubConsole = stub<Console>(console, 'error');
    stubFS.returns(['cpp.packages.json']);

    const init = new Init();

    expect(stubFS.calledOnceWith('.')).to.be.equals(true);
    expect(stubConsole.calledOnceWith('Já existe um arquivo de configuração.')).to.be.equals(true);
  });

  it('should ask questions and create config file', () => {
    stubFS.returns([]);
    stubInquirer.returns(new Promise(() => {
      return {
        name: 'name',
        description: 'description',
        version: 'version'
      };
    }));
    const name = new InitModel('name', 'input', 'Enter a name for the project', 'cpp-package-manager');
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');
    const questions = new Array<{}>(name.toObject(), description.toObject(), version.toObject());
    const mockPath = '/Users/johndoe/Documents/cpp-package-manager';
    const stubProcess = stub(process, 'cwd').returns(mockPath);
    const stubPath = stub(path, 'basename').returns('cpp-package-manager');

    const init = new Init();

    expect(stubFS.calledOnceWith('.')).to.be.equals(true);
    expect(stubInquirer.calledOnceWith(questions)).to.be.equals(true);
    expect(stubProcess.calledOnceWith()).to.be.equals(true);
    expect(stubPath.calledOnceWith(mockPath)).to.be.equals(true);
  });
});
