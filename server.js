'use strict';

var restify = require('restify');
var HTTPStatus = require('http-status');

var config = require('./config');

var LokiBasedDataHub = require('./lib/LokiBasedDataHub');

var dataHub = LokiBasedDataHub.create();

config.resources.forEach(function(resource) {
    dataHub.plugResource(resource);
});

dataHub.start();

var PORT = process.env.GS_PORT | 9000;

var serviceName = 'DataHub';
var serviceVersion = '1.0.0';

var server = restify.createServer({
    'name': serviceName + ' pid:' + process.pid,
    'version': serviceVersion
});

server.use(restify.bodyParser());

server.get('/metrics/:resource/:minutes', function (req, res, next) {
    var result = dataHub.getResourceData(req.params.resource, minutes);
    res.send(HTTPStatus.HTTP_OK, result);
    return next();
});


server.listen(PORT, function () {
    console.log('%s listening at %s', server.name, server.url);
});


