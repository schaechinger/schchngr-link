/**
 * shortkey
 * Copyright (c) 2018 Manuel Schächinger
 * MIT Lisenced
 */

'use strict';

const Link = require('../lib/Link'),
  errors = require('../lib/errors'),
  error404 = require('./error404');

const link = Link.getInstance();

/**
 * Checks the given key and redirects the client or displays an error message.
 * 
 * @param {Request} req 
 * @param {Response} res
 */
module.exports = (req, res) => {
  const key = req.params.shortkey,
    platform = req.params.platform,
    url = link.lookup(key, platform);

  if (url) {
    res.redirect(301, url);

    return;
  }
  
  error404(req, res);
};
