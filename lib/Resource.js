'use strict';

var Promise = require('bluebird');

function Resource (name, client, db, looper) {
    this.name = name;
    this.client = client;
    this.db = db;
    this.endpoints = {};
}

Resource.prototype.addEndpoint = function (collectionName, endpoint, interval) {
    this.endpoints[collectionName] = {
        collection: collectionName,
        endpoint: endpoint,
        interval: interval
    };
    return collectionName;
};
Resource.prototype.removeEndpoint = function (collectionName) {
    this.endpoints[collectionName] = null;
};

Resource.prototype.findEndpoint = function (collectionName) {
    return this.endpoints[collectionName] || null;
};

Resource.prototype.getEndpoints = function() {
    Object.keys(this.endpoints).forEach((endpoint) => {
        return this.endpoints[endpoint];
    });
};

Resource.prototype.startCollecting = function() {

    this.getEndpoints().forEach((endpoint) => {
        this.client.retrieve(endpoint).then
    });

};

module.exports = Resource;



