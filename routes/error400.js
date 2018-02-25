/**
 * shortkey
 * Copyright (c) 2018 Manuel Schächinger
 * MIT Lisenced
 */

'use strict';

const errors = require('../lib/errors');

/**
 * Displays an error message if parameters are missing or the post route does
 * not exist.
 * 
 * @param {Request} req 
 * @param {Response} res
 */
module.exports = (req, res) => {
  res.status(400).json({
    success: false,
    message: errors.add.missingParameters
  });
};
