'use strict';

var clientFactory = require('./ClientFactory')();
var lokiDataRepository = require('./LokiDataRepository')(__dirname + './../db/');
var daemonFactory = require('./DaemonFactory');
var HttpJsonClientFactory = require('./HttpJsonClientFactory').HttpJsonClientFactory();
var DataHub = require('./DataHub').DataHub;
module.exports.create = function() {
    clientFactory.addClientTypeFactory('http-json', HttpJsonClientFactory , true);
    return new DataHub(clientFactory, lokiDataRepository, daemonFactory)
};
