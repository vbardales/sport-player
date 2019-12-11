import app, { start, stop } from './app';
import * as appFn from './app';
import * as Server from './components/server';

describe('app', () => {
  describe('default', () => {
    it('should exist and be an object', () => {
      expect(app).to.exist().and.to.deep.equal({});
    });
  });

  describe('#start', () => {
    let app;
    const config = {};
    let server;

    beforeEach(() => {
      app = {};
      server = sinon.createStubInstance(Server.default);
      server.start.resolves();
      sinon.stub(Server, 'default').callsFake(() => server);
      sinon.stub(appFn, 'stop').resolves();
    });

    afterEach(() => {
      Server.default.restore();
      appFn.stop.restore();
    });

    it('should exist and be a function', () => {
      expect(start).to.exist().and.to.be.a('Function');
    });

    it('should declare a server', async () => {
      await start(app, config);
      expect(Server.default).to.have.been.calledOnce();
      expect(app).to.have.property('server').that.equal(server);
    });

    it('should start server', async () => {
      await start(app, config);
      expect(server.start).to.have.been.calledOnce();
    });

    it('should gracefully stop if an error occurred during startup', async () => {
      server.start.reset();
      server.start.rejects(new Error('Unexpected error'));
      await start(app, config);
      expect(appFn.stop).to.have.been.calledOnce().and.calledWith(app);
    });
  });

  describe('#stop', () => {
    let app;
    const config = {};
    let server;

    beforeEach(() => {
      app = {};
      server = sinon.createStubInstance(Server.default);
      server.stop.resolves();
    });

    it('should exist and be a function', () => {
      expect(stop).to.exist().and.to.be.a('Function');
    });

    it('should stop a server, if set', async () => {
      app.server = server;
      await stop(app, config);
      expect(server.stop).to.have.been.calledOnce();
    });

    it('should not fail if no server', async () => {
      await stop(app, config);
    });
  });
});
