'use strict';

var Daemon = require('./Daemon');

function DaemonFactory() {

}

DaemonFactory.prototype.create = function(lambda, interval, args=[]) {
  return new Daemon(lambda, interval, args);
};