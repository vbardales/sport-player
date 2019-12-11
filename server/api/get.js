import _ from 'lodash';

export default (app, config) => ({
  method: 'GET',
  uri: '/players/:id',
  controller: (req) => {

    const id = _.parseInt(req.params.id);
    if (_.isNaN(id)) {
      const error = new Error(`ID "${req.params.id}" is not a valid number`);
      error.status = 400;
      error.errCode = 'BAD_PARAMETER';
      throw error;
    }

    const player = _.find(app.db, { id });
    if (player) {
      return player;
    }

    const error = new Error(`Player ${id} not found`);
    error.status = 404;
    error.errCode = 'NOT_FOUND';
    throw error;
  },
});
