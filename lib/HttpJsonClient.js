'use strict';

var parser = require('url');

function HttpJsonClient(client) {
    this.clientType ='http-json';
    this.client = client;
}


HttpJsonClient.prototype.retrieve = function(resource, endpoint) {
    return this.client.getAsync(this.getPath(endpoint.url))
        .spread(function(req, res, obj) {
            return JSON.parse(res.body);
        });
};

HttpJsonClient.prototype.getPath = function(url) {
    return parser.parse(url).path;
};

module.exports.HttpJsonClient = HttpJsonClient;
