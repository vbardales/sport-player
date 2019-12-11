import Promise from 'bluebird';

import Server from './components/server';
import indexAction from './api/index';
import findAction from './api/find';

const app = {};
export default app;

export async function start(app, config) {
  console.log('Starting');

  const server = new Server(config.ip, config.port);
  app.server = server;

  app.db = require('./components/db/fixtures.json').players;

  const index = indexAction(app, config);
  const find = findAction(app, config);
  server.addRoute(index.method, index.uri, index.controller);
  server.addRoute(find.method, find.uri, find.controller);

  try {
    await server.start();
  } catch (err) {
    console.error(`A startup error occurred: ${err.message}`, err);
    console.log('Trying to gracefully stop the app');
    try {
      await exports.stop(app);
    } catch (err) {
      console.log('Forcing the app stop', err);
      process.exit(1);
    }
  }
}

export async function stop(app) {
  return Promise.all([
    app.server && app.server.stop(),
  ]);
}
