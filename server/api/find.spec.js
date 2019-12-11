import findAction from './find';

describe('find action', () => {
  const app = {};
  const config = {};

  it('should exist and be a function', () => {
    expect(findAction).to.exist().and.to.be.a('Function');
  });

  it('should have a method', () => {
    expect(findAction(app, config)).to.have.property('method').that.is.a('String');
  });

  it('should have an uri', () => {
    expect(findAction(app, config)).to.have.property('uri').that.is.a('String');
  });

  it('should have a controller', () => {
    expect(findAction(app, config)).to.have.property('controller').that.is.a('Function');
  });

  describe('.controller', () => {
    let controller;
    let app;
    const config = {};
    const obj1 = {
      id: '1',
    };
    const obj2 = {
      id: '2',
    };
    const obj3 = {
      id: '3',
    };
    const db = [obj3, obj1, obj2];

    beforeEach(() => {
      app = {};
      app.db = db;
      controller = findAction(app, config).controller;
    });

    it('should exist and be a function', () => {
      expect(controller).to.exist().and.be.a('Function');
    });

    it('should return the db sorted by id', () => {
      expect(controller()).to.deep.equal([obj1, obj2, obj3]);
    });
  });
});
