import app, { start } from './app';

describe('app', () => {
  describe('default', () => {
    it('should exist and be an object', () => {
      expect(app).to.exist().and.to.deep.equal({});
    });
  });

  describe('#start', () => {
    it('should exist and be a function', () => {
      expect(start).to.exist().and.to.be.a('Function');
    });
  });
});
