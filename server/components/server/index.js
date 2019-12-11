import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import http from 'http';
import Promise from 'bluebird';
import _ from 'lodash';

export default class Server {
  constructor(ip, port) {
    this.ip = ip;
    this.port = port;

    this.expressApp = express();

    this.expressApp.use(helmet());
    this.expressApp.use(compression());

    this.expressApp.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
    this.expressApp.use(bodyParser.json({ limit: '50mb' }));
    this.expressApp.use(methodOverride());
    this.expressApp.use(helmet.noCache());
    this.expressApp.disable('etag');

    this.server = http.createServer(this.expressApp);
    this.stream = null;
    this.isUp = false;
  }

  addRoute(method, uri, controller) {
    if (this.isUp) {
      console.warn('Server is already started, please switch it off to add routes');
      return;
    }

    const normalizedMethod = _.toLower(method);
    if (!_.includes(['get', 'post', 'put', 'delete'], normalizedMethod)) {
      throw new Error(`Unknown HTTP method: ${normalizedMethod}`);
    }

    this.expressApp[normalizedMethod](uri, async (req, res) => {
      try {
        const data = await controller(req, res);
        res.json(data);
      } catch (e) {
        res.status(_.get(e, 'status', 500)).json({
          status: _.get(e, 'status', 500),
          errCode: _.get(e, 'errCode', 'UNEXPECTED_ERROR'),
          error: e.message,
        });
      }
    });
    console.log(`Registered ${method} ${uri} controller`);
  }

  async start() {
    if (this.isUp) {
      return;
    }

    return new Promise((resolve) => {
      this.stream = this.server.listen(this.port, this.ip, () => {
        console.log(`Server listening on ${this.port}`);
        this.isUp = true;
        resolve();
      });
      this.stream.on('close', () => {
        console.log('Server closed');
        this.isUp = false;
        this.stream = null;
      });
    });
  }

  async stop() {
    if (!this.isUp) {
      return;
    }

    return new Promise((resolve) => {
      this.stream.close(resolve);
    });
  }
}
