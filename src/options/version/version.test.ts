import Log from '../log/log';
import Version from './version';
import * as fs from 'fs';
import Exec, { ExecResultModel } from '../../lib/exec';

describe('Version', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should print the version', async () => {
    const currentVersion = '1.0.0';
    const execResult = new ExecResultModel(null, '/usr/local/lib/node_modules\n', '');
    const spyExec = jest.spyOn(Exec, 'command').mockImplementation(() => { }).mockResolvedValue(execResult);
    const file = Buffer.from(JSON.stringify({ version: currentVersion }));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { }).mockReturnValueOnce(file);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const version = new Version(logMock);
    await version.printVersion();

    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyExec).toHaveBeenNthCalledWith(1, 'npm root -g', { cwd: process.cwd() });

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith('/usr/local/lib/node_modules/cpp-package-manager/package.json');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(currentVersion);

  });

  it('should try print the version and throw an error', async () => {
    const spyExec = jest.spyOn(Exec, 'command').mockImplementation(() => { }).mockRejectedValue('error on show the version');

    const LogMock = jest.fn<Log>(() => ({
      createErrorLog: jest.fn(),
    }));
    const logMock = new LogMock();
    const version = new Version(logMock);
    await version.printVersion();

    expect(spyExec).toHaveBeenCalledTimes(1);
    expect(spyExec).toHaveBeenNthCalledWith(1, 'npm root -g', { cwd: process.cwd() });

    expect(logMock.createErrorLog).toHaveBeenCalledTimes(1);
    expect(logMock.createErrorLog).toHaveBeenCalledWith('error on show the version');

  });
});
