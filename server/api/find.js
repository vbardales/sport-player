import _ from 'lodash';

export default (app, config) => ({
  method: 'GET',
  uri: '/players',
  controller: () => {
    return _.sortBy(app.db, 'id');
  },
});
