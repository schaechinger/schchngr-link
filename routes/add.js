/**
 * shortkey
 * Copyright (c) 2018 Manuel Schächinger
 * MIT Lisenced
 */

'use strict';

const config = require('config');

const Link = require('../lib/Link'),
  error400 = require('./error400');

const link = Link.getInstance();

/**
 * Tries to create a short key for the given url if it is not in the store already.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports = (req, res) => {
  const url = req.body.url,
    secret = req.body.secret;

  if (url && config.get('secret') === secret) {
    const key = link.store(url);

    if (key) {
      res.status(201).json({
        success: true,
        shortkey: key,
        url: url
      });

      return;
    }
  }

  error400(req, res);
};
