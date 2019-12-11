import request from 'request-promise';
import _ from 'lodash';

export default class DB {
  constructor(queryUrl, staticDB) {
    if (!queryUrl) {
      this.db = staticDB;
      this.get = async () => this.db;
      return this;
    }

    this.queryUrl = queryUrl;
  }

  async get() {
    const res = await request.get({
      url: this.queryUrl,
      json: true,
    });

    if (!_.get(res, 'players')) {
      console.warn(`No players found on url ${this.queryUrl}`);
    }

    return res.players;
  }
}
