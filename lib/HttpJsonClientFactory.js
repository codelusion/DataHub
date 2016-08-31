'use strict';

var restify = require('restify');
var parser = require('url');
var Promise = require('bluebird');
Promise.promisifyAll(restify.JsonClient.prototype);
var HttpJsonClient = require('./HttpJsonClient').HttpJsonClient;

function HttpJsonClientFactory() {}

HttpJsonClientFactory.prototype.create = function(resource, endpoint) {
    //get domain host from endpoint
    //if not found, get from resource
    var baseUrl =  this.getBaseUrl(endpoint.url) || this.getBaseUrl(resource.domain);
    var options = {
        'url': baseUrl
    };

    var headers = this.getHeaders(resource, endpoint);

    if (headers) {
        options.headers = headers;
    }
    return new HttpJsonClient(restify.createJSONClient(options));
};

HttpJsonClientFactory.prototype.getBaseUrl = function(url) {
    if (url) {
        var parsedUrl = parser.parse(url);
        return [parsedUrl.protocol, parsedUrl.host].join('//');
    }
};

HttpJsonClientFactory.prototype.getHeaders = function(resource, endpoint){
    var result = {};
    //start with resource headers, if any
    //then apply endpoint headers, if any
    [resource.headers, endpoint.headers].forEach(function(headers) {
        if (headers) {
            for (var headerKey in headers) {
                if (headers.hasOwnProperty(headerKey)) {
                    result[headerKey] = headers[headerKey];
                }
            }
        }
    });
    return result;
};

module.exports.HttpJsonClientFactory = function() {
  return new HttpJsonClientFactory();
};