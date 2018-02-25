/**
 * shortkey
 * Copyright (c) 2018 Manuel Schächinger
 * MIT Lisenced
 */

'use strict';

const errors = require('../lib/errors');

/**
 * Displays an error message if the given key was not found.
 * 
 * @param {Request} req 
 * @param {Response} res
 */
module.exports = (req, res) => {
  res.status(404).json({
    success: false,
    shortkey: req.params.shortkey,
    message: errors.lookup.keyNotFound
  });
};
