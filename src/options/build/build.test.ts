import Build from './build';
import * as fs from 'fs';
import DependenciesModel from '../dependencies.model';
import ConfigProjectModel from '../config-project.model';
import ConfigBuildModel from '../config-build.model';
const child_process = require('child_process');

describe('Build', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should not find config file', () => {
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

    new Build();

    expect(spyConsoleError).toHaveBeenCalledTimes(1);
    expect(spyConsoleError).toHaveBeenCalledWith('There is no configuration file.');

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

  });

  it('should read dependencies and compile binaries not based in build file', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockResolvedValueOnce('');
    const configProjectFile = new ConfigProjectModel({ name: 'test', description: 'testDesc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configProjectFile.dependencies = new Array<DependenciesModel>(dependencie);
    const file = Buffer.from(JSON.stringify(configProjectFile));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { }).mockReturnValue(file);
    const directory = { cwd: `${process.cwd()}/cpm_modules/${dependencie.name}` };
    const spyChildProcessExec = jest.spyOn(child_process, 'exec').mockImplementation(() => { });

    new Build();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpm.packages.json`);

    expect(spyChildProcessExec).toHaveBeenCalledTimes(2);
    const cleanDistFolder = 'rm -rf dist && mkdir dist &&';
    const generateBinariesInDistFolder = `g++ -c src/**/*.cpp **/*.cpp && mv *.o dist/`;
    expect(spyChildProcessExec).toHaveBeenNthCalledWith(1, 'cpm build', directory);
    expect(spyChildProcessExec).toHaveBeenNthCalledWith(2, `${cleanDistFolder} ${generateBinariesInDistFolder}`, {cwd: process.cwd()});
  });

  it('should read dependencies and compile binaries based in build file', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockReturnValueOnce('cpm.build.json');

    const configProjectFile = new ConfigProjectModel({ name: 'test', description: 'testDesc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configProjectFile.dependencies = new Array<DependenciesModel>(dependencie);
    const fileConfigProjectProject = Buffer.from(JSON.stringify(configProjectFile));

    const configBuildFile = new ConfigBuildModel({
      fileName: 'main',
      binaries: ['main', 'implementationA', 'implementationB', 'implementationC']
    });
    const fileConfigBuildProject = Buffer.from(JSON.stringify(configBuildFile));

    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { })
    .mockReturnValueOnce(fileConfigProjectProject)
    .mockReturnValueOnce(fileConfigBuildProject);

    const directory = { cwd: `${process.cwd()}/cpm_modules/${dependencie.name}` };
    const spyChildProcessExec = jest.spyOn(child_process, 'exec').mockImplementation(() => { });

    new Build();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(2);
    expect(spyReadFileSync).toHaveBeenNthCalledWith(1, `${process.cwd()}/cpm.packages.json`);
    expect(spyReadFileSync).toHaveBeenNthCalledWith(2, `${process.cwd()}/cpm.build.json`);

    expect(spyChildProcessExec).toHaveBeenCalledTimes(2);
    expect(spyChildProcessExec).toHaveBeenNthCalledWith(1, 'cpm build', directory);
    const cleanDistFolder = 'rm -rf dist && mkdir dist &&';
    const generateBinariesInDistFolder = `g++ -c src/**/*.cpp **/*.cpp && mv *.o dist/ &&`;
    const compileProject = `g++ dist/${configBuildFile.binaries.join(' ')}`;
    const outputFile = `-o dist/${configBuildFile.fileName}`;
    expect(spyChildProcessExec)
    .toHaveBeenNthCalledWith(2, `${cleanDistFolder} ${generateBinariesInDistFolder} ${compileProject} ${outputFile}`, {cwd: process.cwd()});
  });

  it('should read dependencies and compile binaries based in build file without fileName', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockReturnValueOnce('cpm.build.json');

    const configProjectFile = new ConfigProjectModel({ name: 'test', description: 'testDesc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configProjectFile.dependencies = new Array<DependenciesModel>(dependencie);
    const fileConfigProjectProject = Buffer.from(JSON.stringify(configProjectFile));

    const configBuildFile = new ConfigBuildModel({
      binaries: ['main', 'implementationA', 'implementationB', 'implementationC']
    });
    const fileConfigBuildProject = Buffer.from(JSON.stringify(configBuildFile));

    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { })
    .mockReturnValueOnce(fileConfigProjectProject)
    .mockReturnValueOnce(fileConfigBuildProject);

    const directory = { cwd: `${process.cwd()}/cpm_modules/${dependencie.name}` };
    const spyChildProcessExec = jest.spyOn(child_process, 'exec').mockImplementation(() => { });

    new Build();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(2);
    expect(spyReadFileSync).toHaveBeenNthCalledWith(1, `${process.cwd()}/cpm.packages.json`);
    expect(spyReadFileSync).toHaveBeenNthCalledWith(2, `${process.cwd()}/cpm.build.json`);

    expect(spyChildProcessExec).toHaveBeenCalledTimes(2);
    expect(spyChildProcessExec).toHaveBeenNthCalledWith(1, 'cpm build', directory);
    const cleanDistFolder = 'rm -rf dist && mkdir dist &&';
    const generateBinariesInDistFolder = `g++ -c src/**/*.cpp **/*.cpp && mv *.o dist/ &&`;
    const compileProject = `g++ dist/${configBuildFile.binaries.join(' ')}`;
    const outputFile = `-o dist/${configBuildFile.fileName}`;
    expect(spyChildProcessExec)
    .toHaveBeenNthCalledWith(2, `${cleanDistFolder} ${generateBinariesInDistFolder} ${compileProject} ${outputFile}`, {cwd: process.cwd()});
  });

  it('should read dependencies and not compile binaries because the build file', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockReturnValueOnce('cpm.build.json');

    const configProjectFile = new ConfigProjectModel({ name: 'test', description: 'testDesc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configProjectFile.dependencies = new Array<DependenciesModel>(dependencie);
    const fileConfigProjectProject = Buffer.from(JSON.stringify(configProjectFile));

    const configBuildFile = new ConfigBuildModel({});
    const fileConfigBuildProject = Buffer.from(JSON.stringify(configBuildFile));

    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { })
    .mockReturnValueOnce(fileConfigProjectProject)
    .mockReturnValueOnce(fileConfigBuildProject);

    try {
      new Build();
    } catch (error) {
      expect(error.message).toBe('The file cpm.build.json is not in correct pattern.');
    }

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(2);
    expect(spyReadFileSync).toHaveBeenNthCalledWith(1, `${process.cwd()}/cpm.packages.json`);
    expect(spyReadFileSync).toHaveBeenNthCalledWith(2, `${process.cwd()}/cpm.build.json`);
  });
});
