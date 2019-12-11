import _ from 'lodash';

export default (app, config) => ({
  method: 'GET',
  uri: '/players',
  controller: async () => {
    const db = await app.db.get();
    return _.sortBy(db, 'id');
  },
});
