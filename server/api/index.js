import _ from 'lodash';

export default (app, config) => ({
  method: 'GET',
  uri: '/',
  controller: () => ({
    '/players': {
      methods: {
        GET: 'Get a list of players sorted by id',
      },
    },
  }),
});
