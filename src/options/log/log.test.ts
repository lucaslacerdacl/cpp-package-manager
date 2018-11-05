import Log from './log';
import * as fs from 'fs';
import LogModel from './log.model';

describe('Log', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create log file', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
    const spyWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { });
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
    const errMessage = 'err';

    new Log(errMessage);

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith('An error has occurred! Check the log file.');

    expect(spyWriteFileSync).toHaveBeenCalledTimes(1);
    const errors = new Array<LogModel>(new LogModel(errMessage));
    expect(spyWriteFileSync).toHaveBeenCalledWith('cpm.log.json', JSON.stringify(errors, null, 2));

  });

  it('should add error in log file', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpm.log.json']);
    const spyWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { });
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
    const errMessage = 'err 1';
    const error = new Array<LogModel>(new LogModel('err 2'));
    const file = Buffer.from(JSON.stringify(error));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {}).mockReturnValue(file);

    new Log(errMessage);

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith('An error has occurred! Check the log file.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith('cpm.log.json');

    expect(spyWriteFileSync).toHaveBeenCalledTimes(1);
    const errors = new Array<LogModel>(new LogModel('err 2'), new LogModel(errMessage));
    expect(spyWriteFileSync).toHaveBeenCalledWith('cpm.log.json', JSON.stringify(errors, null, 2));

  });

});
