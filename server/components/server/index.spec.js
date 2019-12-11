import _ from 'lodash';

import Server from '.';

describe('Server', () => {
  describe('constructor', () => {
    const ip = 'ip';
    const port = 'port';

    it('should exist and be a function', () => {
      expect(Server).to.exist().and.to.be.a('Function');
    });

    it('should instanciate a Server', () => {
      expect(new Server()).to.be.an.instanceOf(Server);
    });

    it('should initialize ip', () => {
      expect(new Server(ip, port)).to.have.property('ip').that.equal(ip);
    });

    it('should initialize port', () => {
      expect(new Server(ip, port)).to.have.property('port').that.equal(port);
    });

    it('should initialize express app', () => {
      expect(new Server(ip, port)).to.have.property('expressApp');
    });

    it('should initialize server', () => {
      expect(new Server(ip, port)).to.have.property('server');
    });

    it('should initialize server state to down', () => {
      expect(new Server(ip, port)).to.have.property('isUp').to.be.false();
    });

    it('should initialize the server stream', () => {
      expect(new Server(ip, port)).to.have.property('stream').that.is.null();
    });
  });

  describe('::addRoute', () => {
    let server;
    const ip = 'ip';
    const port = 'port';
    const expressApp = {
      get: _.noop,
    };
    const method = 'GET';
    const uri = '/';
    let controller;

    beforeEach(() => {
      server = new Server(ip, port);
      server.expressApp = expressApp;
      sinon.stub(expressApp, 'get');
      controller = sinon.stub();
    });

    afterEach(() => {
      expressApp.get.restore();
    });

    it('should exist and be a function', () => {
      expect(server.addRoute).to.exist().and.to.be.a('Function');
    });

    it('should add a given route to express app', () => {
      server.addRoute(method, uri, controller);
      expect(expressApp.get).to.have.been.calledOnce().and.calledWith(uri);
    });

    describe('handler', () => {
      let handler;
      const req = {};
      const res = {
        json: _.noop,
      };
      const data = {};

      beforeEach(() => {
        server.addRoute(method, uri, controller);
        handler = expressApp.get.args[0][1];
        sinon.stub(res, 'json');
      });

      afterEach(() => {
        res.json.restore();
      });

      it('should get data from controller', async () => {
        controller.returns(data);
        await handler(req, res);
        expect(controller).to.have.been.calledOnce().and.calledWith(req, res);
      });

      it('should return data as json', async () => {
        controller.returns(data);
        await handler(req, res);
        expect(res.json).to.have.been.calledOnce().and.calledWith(data);
      });

      it('should get data from controller even if async', async () => {
        controller.resolves(data);
        await handler(req, res);
        expect(controller).to.have.been.calledOnce().and.calledWith(req, res);
      });

      it('should return data as json even if async', async () => {
        controller.resolves(data);
        await handler(req, res);
        expect(res.json).to.have.been.calledOnce().and.calledWith(data);
      });
    });

    it('should not add route if already up', () => {
      server.isUp = true;
      server.addRoute(method, uri, controller);
      expect(expressApp.get).to.not.have.been.called();
    });

    it('should throw if method is not allowed', () => {
      const wrongMethod = 'Unknown';
      expect(() => server.addRoute(wrongMethod, uri, controller)).to.throw('Unknown HTTP method: unknown');
    });
  });

  describe('::start', () => {
    let server;
    const ip = '0.0.0.0';
    const port = '3000';
    const stream = {
      on: _.noop,
    };
    const httpServer = {
      listen: (port, ip, cb) => {
        cb();
        return stream;
      },
    };

    beforeEach(() => {
      server = new Server(ip, port);
      server.server = httpServer;
    });

    it('should exist and be a function', () => {
      expect(server.start).to.exist().and.to.be.a('Function');
    });

    it('should instanciate a stream', async () => {
      await server.start();
      expect(server.stream).to.not.be.null();
    });

    it('should set server to up', async () => {
      await server.start();
      expect(server.isUp).to.be.true();
    });

    describe('on stream close', () => {
      let cb;

      beforeEach(async () => {
        server.stream = stream;
        server.stream.on = (eventName, _cb) => cb = _cb;
        await server.start();
      });

      it('should set server to down', () => {
        cb();
        expect(server.isUp).to.be.false();
      });

      it('should clear stream', () => {
        cb();
        expect(server.stream).to.be.null();
      });
    });

    it('should not instanciate a new stream if already up', async () => {
      server.isUp = true;
      await server.start();
      expect(server.stream).to.be.null();
    });
  });

  describe('::stop', () => {
    let server;
    const ip = '0.0.0.0';
    const port = '3000';
    const stream = {
      close: _.noop,
    };

    beforeEach(() => {
      server = new Server(ip, port);
      server.isUp = true;
      server.stream = stream;
      sinon.stub(stream, 'close').callsFake((cb) => cb());
    });

    afterEach(() => {
      stream.close.restore();
    });

    it('should exist and be a function', () => {
      expect(server.stop).to.exist().and.to.be.a('Function');
    });

    it('should close the stream', async () => {
      await server.stop();
      expect(stream.close).to.have.been.calledOnce();
    });

    it('should not close the stream if already down', async () => {
      server.isUp = false;
      await server.stop();
      expect(stream.close).to.not.have.been.called();
    });
  });
});
