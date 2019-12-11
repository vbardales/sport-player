import indexAction from './index';

describe('index action', () => {
  const app = {};
  const config = {};

  it('should exist and be a function', () => {
    expect(indexAction).to.exist().and.to.be.a('Function');
  });

  it('should have a method', () => {
    expect(indexAction(app, config)).to.have.property('method').that.is.a('String');
  });

  it('should have an uri', () => {
    expect(indexAction(app, config)).to.have.property('uri').that.is.a('String');
  });

  it('should have a controller', () => {
    expect(indexAction(app, config)).to.have.property('controller').that.is.a('Function');
  });

  describe('.controller', () => {
    let controller;
    const app = {};
    const config = {};

    beforeEach(() => {
      controller = indexAction(app, config).controller;
    });

    it('should exist and be a function', () => {
      expect(controller).to.exist().and.be.a('Function');
    });

    it('should return an index', () => {
      expect(controller()).to.be.an('object');
    });
  });
});
