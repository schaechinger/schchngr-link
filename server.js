/**
 * shortkey
 * Copyright (c) 2018 Manuel Schächinger
 * MIT Lisenced
 */

'use strict';

const bodyParser = require('body-parser'),
  config = require('config'),
  express = require('express'),
  pino = require('./lib/helper/pino');

const routes = require('./routes');

const app = express();
app.set('port', config.get('server.port'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/:shortkey([a-z0-9]{1,5}):platform([gflmtx]?)', routes.lookup);
app.get('/:shortkey', routes.error404);

app.post('/_add', routes.add);
app.post('*', routes.error400);

app.listen(app.get('port'), () => {
  pino.info(`shortkey service running on port ${app.get('port')}`);
});
