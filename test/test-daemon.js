'use strict';

var chai = require('chai');
var should = chai.should();
var Daemon = require('../lib/Daemon');
var sinon = require('sinon');
var clock;

describe('Daemon', () => {

    before(function () { clock = sinon.useFakeTimers(); });
    after(function () { clock.restore(); });

    describe('#it should call functions with args repeatedly', () => {
        it('it should call functions with args controlled by start(), stop(), reset()', () => {
            var loopFunc = sinon.spy();
            var args = ['arg1', 'arg2'];
            var daemon = new Daemon(loopFunc, 1000, args);
            clock.tick(500);
            loopFunc.notCalled.should.equal(true);
            clock.tick(501);
            loopFunc.calledOnce.should.equal(false);
            daemon.start();
            loopFunc.calledOnce.should.equal(false);
            clock.tick(501);
            loopFunc.calledOnce.should.equal(false);
            clock.tick(501);
            loopFunc.calledOnce.should.equal(true);
            loopFunc.calledWith(args).should.equal(true);
            daemon.stop();
            clock.tick(501);
            loopFunc.calledOnce.should.equal(true);
            daemon.reset(2000);
            clock.tick(1001);
            loopFunc.calledOnce.should.equal(true);
            clock.tick(1000);
            loopFunc.callCount.should.equal(2);
            loopFunc.calledWith(args).should.equal(true);
        });

    });
});



