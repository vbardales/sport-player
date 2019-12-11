import getAction from './get';

describe('get action', () => {
  const app = {};
  const config = {};

  it('should exist and be a function', () => {
    expect(getAction).to.exist().and.to.be.a('Function');
  });

  it('should have a method', () => {
    expect(getAction(app, config)).to.have.property('method').that.is.a('String');
  });

  it('should have an uri', () => {
    expect(getAction(app, config)).to.have.property('uri').that.is.a('String');
  });

  it('should have a controller', () => {
    expect(getAction(app, config)).to.have.property('controller').that.is.a('Function');
  });

  describe('.controller', () => {
    let controller;
    let app;
    const config = {};
    const obj1 = {
      id: 1,
    };
    const obj2 = {
      id: 2,
    };
    const obj3 = {
      id: 3,
    };
    const db = {
      get: async () => [obj3, obj1, obj2],
    };
    const res = {
      status: () => res,
      json: () => res,
    };

    beforeEach(() => {
      app = {};
      app.db = db;
      controller = getAction(app, config).controller;
    });

    it('should exist and be a function', () => {
      expect(controller).to.exist().and.be.a('Function');
    });

    it('should throw and send if input is not a right input', async () => {
      await expect(controller({ params: { id: 'notANumber' }}, res)).to.be.rejectedWith('ID "notANumber" is not a valid number');
    });

    it('should return the found object', async () => {
      expect(await controller({ params: { id: 1 }})).to.equal(obj1);
    });

    it('should throw and send res otherwise', async () => {
      await expect(controller({ params: { id: '4' }}, res)).to.be.rejectedWith('Player 4 not found');
    });
  });
});
