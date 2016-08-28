'use strict';

var Daemon = require('./Daemon');

function DataHub(clientRepository, dataRepository, DaemonFactory) {
    this.clientRepository = clientRepository;
    this.dataRepository = dataRepository;
    this.DaemonFactory = DaemonFactory;
    this.resources = {};
    this.endpoints = {};
    this.daemons = {};
    this.defaultInterval = 6000;
}

DataHub.prototype.plugResource = function (resource) {
    resource.endpoints = resource.endpoints || {};
    this.resources[resource.name] = resource;
    this.dataRepository.initResource(resource.name);
    if (resource.endpoints) {
        resource.endpoints.forEach((endpoint) => {
            this.addEndpoint(resource.name, endpoint)
        });
    }
};

DataHub.prototype.unplugResource = function (resource) {
    delete this.resources[resource.name];
    this.dataRepository.deleteResource(resource.name);
};

DataHub.prototype.addEndpoint = function (resourceName, endpoint) {
    var resource = this.findResource(resourceName);
    if (resource) {
        endpoint = this.setupEndpoint(resource, endpoint);
        this.resources[resource.name].endpoints[endpoint.name] = endpoint;
        this.dataRepository.initResourceCollection(resource.name, endpoint.name);
    }
};

DataHub.prototype.setupEndpoint = function(resource, endpoint) {
    var clientType = endpoint.clientType || resource.clientType;
    var client = clientType ?
        self.clientRepository.getClient(clientType) :
        self.clientRepository.getDefaultClient();
    var interval = endpoint.interval || resource.interval || this.defaultInterval;
    endpoint.lambda = function () {
        return client.retrieve(resource, endpoint).then((data) => {
            return this.dataRepository.persist(resource.name, endpoint.name, data);
        });
    };
    endpoint.clientType = clientType;
    endpoint.interval = interval;
};

DataHub.prototype.start = function (resourceName) {
    var resource = this.findResource(resourceName);
    if (resource.endpoints) {
        resource.endpoints.forEach((endpoint) => {
            var daemonName = resource.name + '.' + endpoint.name;
            this.setupRetrieval(daemonName, interval, endpoint.lambda);
        });
    }
};

DataHub.prototype.setupRetrieval = function(name, interval, lambda) {
    this.daemons[name] = this.DaemonFactory.create(lambda, interval);
};

DataHub.prototype.findResource = function (name) {
    return this.find(this.resources, name);
};

DataHub.prototype.find = function (collection, key) {
    if (!collection || !(typeof collection === 'object')) {
        return null;
    }
    if (Array.isArray(collection)) {
        var idx = collection.indexOf(key);
        if (idx > -1) {
            return collection[idx]
        }
        return null;
    } else {
        return (collection.hasOwnProperty(key) ? collection[key] : null)
    }

};



