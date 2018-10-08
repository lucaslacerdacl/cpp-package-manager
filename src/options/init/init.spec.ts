import { stub, SinonStub } from 'sinon';
import * as inquirer from 'inquirer';
import Init from './init';
import { expect } from 'chai';
import * as fs from 'fs';
import InitModel from './init-questions.model';
import * as path from 'path';
import ConfigFileModel from '../config-file.model';
import Log from '../log/log';

describe('Init method', () => {

  let stubFSRead: SinonStub;
  let stubInquirer: SinonStub;
  let stubProcess: SinonStub;
  let stubPath: SinonStub;
  const mockPath = '/Users/johndoe/Documents/cpp-package-manager';

  before(() => {
    stubFSRead = stub(fs, 'readdirSync');
    stubInquirer = stub(inquirer, 'prompt');
    stubProcess = stub(process, 'cwd').returns(mockPath);
    stubPath = stub(path, 'basename').returns('cpp-package-manager');
  });

  afterEach(() => {
    stubFSRead.reset();
    stubInquirer.reset();
    stubProcess.reset();
    stubPath.reset();
  });

  it('should check and advise if the configuration file already exists', () => {
    const stubConsoleError = stub<Console>(console, 'error');
    stubFSRead.returns(['cpp.packages.json']);

    const log = new Log();
    const init = new Init(log);

    expect(stubFSRead.calledOnceWith('.')).to.be.equals(true);
    expect(stubConsoleError.calledOnceWith('Já existe um arquivo de configuração.')).to.be.equals(true);
  });

  it('should ask questions and create config file', (done) => {
    stubFSRead.returns([]);
    const name = new InitModel('name', 'input', 'Enter a name for the project', 'cpp-package-manager');
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');
    const questions = new Array<{}>(name.toObject(), description.toObject(), version.toObject());
    const log = new Log();
    const initResult = { name: 'name', description: 'description', version: 'version' };
    const stubFSOpen = stub(fs, 'openSync');
    const configFile = new ConfigFileModel(initResult);
    const stubFSWrite = stub(fs, 'writeFileSync');

    stubInquirer.resolves(initResult);

    const init = new Init(log);

    done();

    expect(stubFSRead.calledOnceWith('.')).to.be.equals(true);
    expect(stubProcess.calledOnceWith()).to.be.equals(true);
    expect(stubPath.calledOnceWith(mockPath)).to.be.equals(true);
    expect(stubInquirer.calledOnceWith(questions)).to.be.equals(true);
    expect(stubFSOpen.calledOnceWith('cpp.packages.json', 'w')).to.be.equals(true);
    expect(stubFSWrite.calledOnceWith('cpp.packages.json', JSON.stringify(configFile, null, 2))).to.be.equals(true);
  });

  it('should ask questions and create log file', (done) => {
    stubFSRead.returns([]);
    const name = new InitModel('name', 'input', 'Enter a name for the project', 'cpp-package-manager');
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');
    const questions = new Array<{}>(name.toObject(), description.toObject(), version.toObject());
    const err = `Unexpected Error`;
    const log = new Log();
    const logStub = stub(log, 'createLog');
    stubInquirer.rejects(err);

    const init = new Init(log);

    done();

    expect(stubFSRead.calledOnceWith('.')).to.be.equals(true);
    expect(stubProcess.calledOnceWith()).to.be.equals(true);
    expect(stubPath.calledOnceWith(mockPath)).to.be.equals(true);
    expect(stubInquirer.calledOnceWith(questions)).to.be.equals(true);
    expect(logStub.calledOnceWith(err)).to.be.equals(true);
  });

});
