import { spy, stub } from 'sinon';
import Init from './init';
import { expect } from 'chai';
import * as fs from 'fs';

describe('Init method', () => {

  it('should check and advise if the configuration file already exists', () => {
    const stubConsole = stub<Console>(console, 'error');
    const stubFS = stub(fs, 'readdirSync').returns(['cpp.packages.json']);
    const init = new Init();
    expect(stubFS.calledOnceWith('.')).to.be.equals(true);
    expect(stubConsole.calledOnceWith('Já existe um arquivo de configuração.')).to.be.equals(true);
  });

});
