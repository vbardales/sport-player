import request from 'request-promise';

import DB from './';

describe('DB', () => {
  describe('constructor', () => {
    it('should exist and be a function', () => {
      expect(DB).to.exist().and.to.be.a('Function');
    });

    it('should return an instance of DB', () => {
      expect(new DB()).to.be.an.instanceOf(DB);
    });

    describe('no queryUrl', () => {
      const db = {};

      it('should initialize db', () => {
        expect(new DB(undefined, db)).to.have.a.property('db').that.equal(db);
      });
    });

    describe('queryUrl', () => {
      const queryUrl = 'url';

      it('should initialize queryUrl', () => {
        expect(new DB(queryUrl)).to.have.a.property('queryUrl').that.equal(queryUrl);
      });
    });
  });

  describe('::get (queryUrl)', () => {
    let db;
    const queryUrl = 'queryUrl';
    const data = {
      players: [],
    };

    beforeEach(() => {
      db = new DB(queryUrl);
      sinon.stub(request, 'get').resolves(data);
    });

    afterEach(() => {
      request.get.restore();
    });

    it('should exist and be a function', () => {
      expect(db.get).to.exist().and.to.be.a('Function');
    });

    it('should request the given url', async () => {
      await db.get();
      expect(request.get).to.have.been.calledOnce();
      expect(request.get.args[0][0].url).to.equal(queryUrl);
    });

    it('should return the given players results', async () => {
      expect(await db.get()).to.equal(data.players);
    });
  });

  describe('::get (data)', () => {
    let db;
    const data = {
      test: 'test'
    };

    beforeEach(() => {
      db = new DB(undefined, data);
    });

    it('should exist and be a function', () => {
      expect(db.get).to.exist().and.to.be.a('Function');
    });

    it('should return the given results', async () => {
      expect(await db.get()).to.equal(data);
    });
  });
});
