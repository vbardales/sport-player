import 'babel-polyfill';
import _ from 'lodash';

import app, { start } from './app';
import config from './config';

config.queryUrl = _.nth(process.argv, 2);

start(app, config);
