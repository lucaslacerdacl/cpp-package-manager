import Init from './init';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import InitModel from './init-questions.model';
import ConfigProjectModel from '../config-project.model';
import * as figlet from 'figlet';
import chalk from 'chalk';
import * as path from 'path';

describe('Init', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should check and advise if the configuration file already exists', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpm.packages.json']);

    try {
      new Init();
    } catch (error) {
      expect(error.message).toBe('A configuration file already exists.');
    }

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');
  });

  it('should ask questions and create config file', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    const spyFiglet = jest.spyOn(figlet, 'textSync').mockImplementation(() => {}).mockReturnValue('Test');
    const name = new InitModel('name', 'input', 'Enter a name for the project', path.basename(process.cwd()));
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');
    const questions = new Array<{}>(name.toObject(), description.toObject(), version.toObject());
    const initResult = { name: 'name', description: 'description', version: 'version' };

    const spyInquirer = jest.spyOn(inquirer, 'prompt').mockResolvedValue(initResult);

    const configFile = new ConfigProjectModel(initResult);
    const spyWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    await new Init();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyInquirer).toHaveBeenCalledTimes(1);
    expect(spyInquirer).toHaveBeenCalledWith(questions);

    expect(spyWriteFileSync).toHaveBeenCalledTimes(1);
    expect(spyWriteFileSync).toHaveBeenCalledWith('cpm.packages.json', JSON.stringify(configFile, null, 2));

    expect(spyFiglet).toHaveBeenCalledTimes(1);
    expect(spyFiglet).toHaveBeenCalledWith('CPM', { horizontalLayout: 'full' });

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith(chalk.yellow('Test'));

  });
});
