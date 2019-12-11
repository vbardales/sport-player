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

    '/players/:id': {
      methods: {
        GET: 'Get one given player based on its id',
      },
    },
  }),
});
