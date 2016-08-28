'use strict';

function Daemon(loopFunction, interval, args) {
    this.loopFunction = loopFunction;
    this.args = args;
    this.interval = interval;
    this.timer = null;
}

Daemon.prototype.start = function()  {
  this.timer = setInterval(this.loopFunction, this.interval, this.args);
};

Daemon.prototype.reset = function(interval) {
    this.stop();
    if (interval) {
        this.interval = interval;
        this.start();
    }
};

Daemon.prototype.stop = function() {
    clearInterval(this.timer);
};

module.exports = Daemon;