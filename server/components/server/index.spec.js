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
