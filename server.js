'use strict';

var restify = require('restify');
var HTTPStatus = require('http-status');

var db = require('./lib/db');
var metricsCollector = require('./lib/collector');

var PORT = process.env.GS_PORT | 9000;

var serviceName = 'monit';
var serviceVersion = '1.0.0';

var server = restify.createServer({
    'name': serviceName + ' pid:' + process.pid,
    'version': serviceVersion
});

server.use(restify.bodyParser());

server.get('/metrics', function (req, res, next) {
    var result = {a : 'b'};
    res.send(HTTPStatus.HTTP_OK, result);
    return next();
});

server.get('/metrics/:minutes', function (req, res, next) {
    var result = {'minutes' : req.params.minutes};
    res.send(HTTPStatus.HTTP_OK, result);
    return next();
});

server.get('/metrics/:collection/:minutes', function (req, res, next) {
    var result = {a : 'b'};
    res.send(HTTPStatus.HTTP_OK, result);
    return next();
});


server.listen(PORT, function () {
    console.log('%s listening at %s', server.name, server.url);
});


