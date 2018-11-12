import * as fs from 'fs';
import DependenciesModel from '../dependencies.model';
import Install from './install';
import ConfigProjectModel from '../config-project.model';
import * as nodegit from 'nodegit';
import Log from '../log/log';
import Exec, { ExecResultModel } from '../../lib/exec';

describe('Install', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should not find config file', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const install = new Install(logMock);

    await install.installDependencies();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('There is no configuration file.');

  });

  it('should read dependencies and install', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpm.packages.json']);
    const configFile = new ConfigProjectModel({ name: 'test', description: 'desc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configFile.dependencies = new Array<DependenciesModel>(dependencie);
    const file = Buffer.from(JSON.stringify(configFile));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { }).mockReturnValueOnce(file);
    const spyNodeGitClone = jest.spyOn(nodegit.Clone, 'clone').mockImplementation(() => { }).mockResolvedValue('');
    const execResult = new ExecResultModel();
    const spyExec = jest.spyOn(Exec, 'command').mockImplementation(() => { }).mockResolvedValue(execResult);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const install = new Install(logMock);

    await install.installDependencies();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpm.packages.json`);

    const path = `${process.cwd()}/cpm_modules/${dependencie.name}`;

    expect(spyNodeGitClone).toHaveBeenCalledTimes(1);
    expect(spyNodeGitClone).toHaveBeenCalledWith(dependencie.url, path);

    expect(spyExec).toHaveBeenCalledTimes(2);
    expect(spyExec).toHaveBeenNthCalledWith(1, 'rm -rf cpm_modules', { cwd: process.cwd() });
    expect(spyExec).toHaveBeenNthCalledWith(2, 'cpm install && cpm build', { cwd: path });

  });

  it('should throw exception when delete cpm_modules folder', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpm.packages.json']);
    const execResult = new ExecResultModel(null, 'Could not delete cpm_modules');
    const spyExec = jest.spyOn(Exec, 'command').mockImplementation(() => { }).mockRejectedValue(execResult);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const install = new Install(logMock);

    await install.installDependencies();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyExec).toHaveBeenCalledWith('rm -rf cpm_modules', { cwd: process.cwd() });

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith(execResult);

  });

  it('should throw exception when clone dependency', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpm.packages.json']);
    const configFile = new ConfigProjectModel({ name: 'test', description: 'desc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configFile.dependencies = new Array<DependenciesModel>(dependencie);
    const file = Buffer.from(JSON.stringify(configFile));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { }).mockReturnValueOnce(file);
    const spyNodeGitClone = jest.spyOn(nodegit.Clone, 'clone').mockImplementation(() => { }).mockRejectedValue('error');
    const execResult = new ExecResultModel();
    const spyExec = jest.spyOn(Exec, 'command').mockImplementation(() => { }).mockResolvedValue(execResult);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const install = new Install(logMock);

    await install.installDependencies();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpm.packages.json`);

    const path = `${process.cwd()}/cpm_modules/${dependencie.name}`;

    expect(spyNodeGitClone).toHaveBeenCalledTimes(1);
    expect(spyNodeGitClone).toHaveBeenCalledWith(dependencie.url, path);

    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyExec).toHaveBeenCalledWith('rm -rf cpm_modules', { cwd: process.cwd() });

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('error');

  });
});
