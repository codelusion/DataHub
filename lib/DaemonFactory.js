'use strict';

var Daemon = require('./Daemon').Daemon;

module.exports.create = function(lambda, interval, args=[]) {
  return new Daemon(lambda, interval, args);
};