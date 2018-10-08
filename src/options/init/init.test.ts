import Init from './init';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as path from 'path';
import InitModel from './init-questions.model';
import ConfigFileModel from '../config-file.model';

describe('Init', () => {

  const spyReaddirSync = jest.spyOn(fs, 'readdirSync');
  const spyInquirer = jest.spyOn(inquirer, 'prompt');
  const spyProcess = jest.spyOn(process, 'cwd');
  const spyPath = jest.spyOn(path, 'basename');

  beforeEach(() => {
    spyReaddirSync.mockReset();
    spyInquirer.mockReset();
    spyProcess.mockReset();
    spyPath.mockReset();
  });

  it('should check and advise if the configuration file already exists', () => {
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    spyReaddirSync.mockReturnValue(['cpp.packages.json']);

    new Init();

    expect(spyConsoleError).toHaveBeenCalledTimes(1);
    expect(spyConsoleError).toHaveBeenCalledWith('Já existe um arquivo de configuração.');
    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

  });

  it('should ask questions and create config file', async () => {
    const mockPath = '/Users/johndoe/Documents/cpp-package-manager';
    spyReaddirSync.mockReturnValue([]);
    spyProcess.mockReturnValue(mockPath);
    spyPath.mockReturnValue('cpp-package-manager');
    const name = new InitModel('name', 'input', 'Enter a name for the project', 'cpp-package-manager');
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');
    const questions = new Array<{}>(name.toObject(), description.toObject(), version.toObject());
    const initResult = { name: 'name', description: 'description', version: 'version' };

    spyInquirer.mockResolvedValue(initResult);

    const configFile = new ConfigFileModel(initResult);
    const spyWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    await new Init();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyProcess).toHaveBeenCalledTimes(1);
    expect(spyProcess).toHaveBeenCalledWith();

    expect(spyPath).toHaveBeenCalledTimes(1);
    expect(spyPath).toHaveBeenCalledWith(mockPath);

    expect(spyInquirer).toHaveBeenCalledTimes(1);
    expect(spyInquirer).toHaveBeenCalledWith(questions);

    expect(spyWriteFileSync).toHaveBeenCalledTimes(1);
    expect(spyWriteFileSync).toHaveBeenCalledWith('cpp.packages.json', JSON.stringify(configFile, null, 2));

  });
});
