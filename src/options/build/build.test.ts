import Build from './build';
import * as fs from 'fs';
import ConfigBuildModel from '../config-build.model';
import Log from '../log/log';
import * as child_process from 'child_process';
import Glob from '../../lib/glob';

describe('Build', () => {

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
    const build = new Build(logMock);

    await build.generateBinaries();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('There is no configuration file.');

  });

  it('should read dependencies and compile binaries not based in build file', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockResolvedValueOnce('');
    const spyExec = jest.spyOn(child_process, 'exec').mockImplementation((command, config, callback) => { callback(null, null, null); });
    const paths = ['file.cpp', 'file2.cpp'];
    const spyGlob = jest.spyOn(Glob, 'findPattern').mockImplementation(() => { }).mockResolvedValue(paths);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const build = new Build(logMock);

    await build.generateBinaries();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyExec).toHaveBeenCalledTimes(1);
    const cleanDistFolder = 'rm -rf dist && mkdir dist &&';
    const generateBinariesInDistFolder = `g++ -c ${paths.join(' ')} && mv *.o dist/`;
    expect(spyExec).toHaveBeenCalledWith(`${cleanDistFolder} ${generateBinariesInDistFolder}`, { cwd: process.cwd() },
      expect.any(Function));
    expect(spyGlob).toHaveBeenCalledTimes(1);
    expect(spyGlob).toHaveBeenCalledWith(`${process.cwd()}/**/*.cpp`);
  });

  it('should read dependencies and compile binaries based in build file', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockReturnValueOnce('cpm.build.json');

    const configBuildFile = new ConfigBuildModel({
      fileName: 'main',
      binaries: ['main', 'implementationA', 'implementationB', 'implementationC']
    });
    const fileConfigBuildProject = Buffer.from(JSON.stringify(configBuildFile));

    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { })
      .mockReturnValueOnce(fileConfigBuildProject);

    const spyExec = jest.spyOn(child_process, 'exec').mockImplementation(() => { });
    const paths = ['file.cpp', 'file2.cpp'];
    const spyGlob = jest.spyOn(Glob, 'findPattern').mockImplementation(() => { }).mockResolvedValue(paths);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const build = new Build(logMock);

    await build.generateBinaries();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpm.build.json`);

    expect(spyExec).toHaveBeenCalledTimes(1);
    const cleanDistFolder = 'rm -rf dist && mkdir dist &&';
    const generateBinariesInDistFolder = `g++ -c ${paths.join(' ')} && mv *.o dist/ &&`;
    const compileProject = `g++ ${configBuildFile.binaries.join(' ')}`;
    const outputFile = `-o dist/${configBuildFile.fileName}`;
    expect(spyExec)
      .toHaveBeenCalledWith(`${cleanDistFolder} ${generateBinariesInDistFolder} ${compileProject} ${outputFile}`, { cwd: process.cwd() },
        expect.any(Function));
    expect(spyGlob).toHaveBeenCalledTimes(1);
    expect(spyGlob).toHaveBeenCalledWith(`${process.cwd()}/**/*.cpp`);
  });

  it('should read dependencies and compile binaries based in build file without fileName', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockReturnValueOnce('cpm.build.json');

    const configBuildFile = new ConfigBuildModel({
      binaries: ['main', 'implementationA', 'implementationB', 'implementationC']
    });
    const fileConfigBuildProject = Buffer.from(JSON.stringify(configBuildFile));

    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { })
      .mockReturnValueOnce(fileConfigBuildProject);

    const spyExec = jest.spyOn(child_process, 'exec').mockImplementation(() => { });
    const paths = ['file.cpp', 'file2.cpp'];
    const spyGlob = jest.spyOn(Glob, 'findPattern').mockImplementation(() => { }).mockResolvedValue(paths);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const build = new Build(logMock);

    await build.generateBinaries();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpm.build.json`);

    expect(spyExec).toHaveBeenCalledTimes(1);
    const cleanDistFolder = 'rm -rf dist && mkdir dist &&';
    const generateBinariesInDistFolder = `g++ -c ${paths.join(' ')} && mv *.o dist/ &&`;
    const compileProject = `g++ ${configBuildFile.binaries.join(' ')}`;
    const outputFile = `-o dist/${configBuildFile.fileName}`;
    expect(spyExec)
      .toHaveBeenCalledWith(`${cleanDistFolder} ${generateBinariesInDistFolder} ${compileProject} ${outputFile}`,
        { cwd: process.cwd() }, expect.any(Function));
    expect(spyGlob).toHaveBeenCalledTimes(1);
    expect(spyGlob).toHaveBeenCalledWith(`${process.cwd()}/**/*.cpp`);
  });

  it('should read dependencies and not compile binaries because the build file', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockReturnValueOnce('cpm.build.json');
    const configBuildFile = new ConfigBuildModel({});
    const fileConfigBuildProject = Buffer.from(JSON.stringify(configBuildFile));

    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { })
      .mockReturnValueOnce(fileConfigBuildProject);

    const paths = ['file.cpp', 'file2.cpp'];
    const spyGlob = jest.spyOn(Glob, 'findPattern').mockImplementation(() => { }).mockResolvedValue(paths);


    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const build = new Build(logMock);

    await build.generateBinaries();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpm.build.json`);

    expect(spyGlob).toHaveBeenCalledTimes(1);
    expect(spyGlob).toHaveBeenCalledWith(`${process.cwd()}/**/*.cpp`);

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('The file cpm.build.json is not in correct pattern.');
  });

  it('should read dependencies and throw exception running command', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json').mockResolvedValueOnce('');
    const spyExec = jest.spyOn(child_process, 'exec').mockImplementation((command, config, callback) => {
      callback('could not read dependencies');
    });
    const paths = ['file.cpp', 'file2.cpp'];
    const spyGlob = jest.spyOn(Glob, 'findPattern').mockImplementation(() => { }).mockResolvedValue(paths);

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const build = new Build(logMock);

    await build.generateBinaries();

    expect(spyReaddirSync).toHaveBeenCalledTimes(2);
    expect(spyReaddirSync).toHaveBeenNthCalledWith(1, '.');
    expect(spyReaddirSync).toHaveBeenNthCalledWith(2, '.');

    expect(spyExec).toHaveBeenCalledTimes(1);
    const cleanDistFolder = 'rm -rf dist && mkdir dist &&';
    const generateBinariesInDistFolder = `g++ -c ${paths.join(' ')} && mv *.o dist/`;
    expect(spyExec).toHaveBeenCalledWith(`${cleanDistFolder} ${generateBinariesInDistFolder}`,
      { cwd: process.cwd() }, expect.any(Function));
    expect(spyGlob).toHaveBeenCalledTimes(1);
    expect(spyGlob).toHaveBeenCalledWith(`${process.cwd()}/**/*.cpp`);

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith({ error: 'could not read dependencies' });
  });

  it('should not find cpp files and throw exception', async () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValueOnce('cpm.packages.json');
    const spyGlob = jest.spyOn(Glob, 'findPattern').mockImplementation(() => { }).mockRejectedValue('not find any cpp files');

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const build = new Build(logMock);

    await build.generateBinaries();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyGlob).toHaveBeenCalledTimes(1);
    expect(spyGlob).toHaveBeenCalledWith(`${process.cwd()}/**/*.cpp`);

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('not find any cpp files');
  });
});
