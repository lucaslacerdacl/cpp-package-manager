import Init from './init';
import * as fs from 'fs';
import InitModel from './init-questions.model';
import ConfigProjectModel from '../config-project.model';
import * as figlet from 'figlet';
import chalk from 'chalk';
import * as path from 'path';
import Log from '../log/log';
import { Inquirer } from 'inquirer';

describe('Init', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should check and advise if the configuration file already exists', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockImplementation().mockReturnValue(['cpm.package.json']);
    const InquirerMock = jest.fn<Inquirer>(() => ({
      prompt: jest.fn(),
    }));
    const inquirerMock = new InquirerMock();
    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const init = new Init(inquirerMock, logMock);

    await init.createConfigFile();

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('A configuration file already exists.');

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');
  });

  it('should ask questions and create config file', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockImplementation().mockReturnValue([]);
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    const spyFiglet = jest.spyOn(figlet, 'textSync').mockImplementation(() => {}).mockReturnValue('Test');
    const name = new InitModel('name', 'input', 'Enter a name for the project', path.basename(process.cwd()));
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');
    const questions = new Array<{}>(name.toObject(), description.toObject(), version.toObject());
    const initResult = { name: 'name', description: 'description', version: 'version' };
    const configFile = new ConfigProjectModel(initResult);
    const spyWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const InquirerMock = jest.fn<Inquirer>(() => ({
      prompt: jest.fn().mockResolvedValue(initResult),
    }));
    const inquirerMock = new InquirerMock();
    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const init = new Init(inquirerMock, logMock);

    await init.createConfigFile();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(inquirerMock.prompt).toHaveBeenCalledTimes(1);
    expect(inquirerMock.prompt).toHaveBeenCalledWith(questions);

    expect(spyWriteFileSync).toHaveBeenCalledTimes(1);
    expect(spyWriteFileSync).toHaveBeenCalledWith('cpm.package.json', JSON.stringify(configFile, null, 2));

    expect(spyFiglet).toHaveBeenCalledTimes(1);
    expect(spyFiglet).toHaveBeenCalledWith('CPM', { horizontalLayout: 'full' });

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith(chalk.yellow('Test'));

  });

  it('should ask questions and create log file', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockImplementation().mockReturnValue([]);
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    const spyFiglet = jest.spyOn(figlet, 'textSync').mockImplementation(() => {}).mockReturnValue('Test');
    const name = new InitModel('name', 'input', 'Enter a name for the project', path.basename(process.cwd()));
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');
    const questions = new Array<{}>(name.toObject(), description.toObject(), version.toObject());
    const InquirerMock = jest.fn<Inquirer>(() => ({
      prompt: jest.fn().mockRejectedValue('Error'),
    }));
    const inquirerMock = new InquirerMock();
    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const init = new Init(inquirerMock, logMock);

    await init.createConfigFile();

    expect(spyFiglet).toHaveBeenCalledTimes(1);
    expect(spyFiglet).toHaveBeenCalledWith('CPM', { horizontalLayout: 'full' });

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith(chalk.yellow('Test'));

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(inquirerMock.prompt).toHaveBeenCalledTimes(1);
    expect(inquirerMock.prompt).toHaveBeenCalledWith(questions);

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('Error');

  });
});
