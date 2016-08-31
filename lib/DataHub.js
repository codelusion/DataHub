'use strict';

function DataHub(clientFactory, dataRepository, daemonFactory) {
    this.clientFactory = clientFactory;
    this.dataRepository = dataRepository;
    this.DaemonFactory = daemonFactory;
    this.resources = {};
    this.daemons = {};
    this.defaultInterval = 6000;
}

DataHub.prototype.plugResource = function (resource) {
    var endpoints = resource.endpoints || [];
    this.resources[resource.name] = resource;
    this.resources[resource.name].endpoints = {};
    this.dataRepository.initResource(resource.name);
    if (endpoints) {
        endpoints.forEach((endpoint) => {
            this.addEndpoint(resource, endpoint)
        });
    }
};

DataHub.prototype.unplugResource = function (resource) {
    delete this.resources[resource.name];
    resource.endpoints.forEach((endpoint) => {
        var daemonName = resource.name + '.' + endpoint.name;
        this.daemons[daemonName].stop();
        delete this.daemons[daemonName];
    });
    this.dataRepository.deleteResource(resource.name);
};

DataHub.prototype.addEndpoint = function (resource, endpoint) {
    if (resource) {
        endpoint = this.setupEndpoint(resource, endpoint);
        this.resources[resource.name].endpoints[endpoint.name] = endpoint;
        this.dataRepository.initResourceCollection(resource.name, endpoint.name);
    }
};

DataHub.prototype.setupEndpoint = function(resource, endpoint) {
    var clientType = endpoint.clientType || resource.clientType ;
    var client = this.clientFactory.getClient(clientType, resource, endpoint);
    var interval = endpoint.interval || resource.interval || this.defaultInterval;
    var daemonName = resource.name + '.' + endpoint.name;
    endpoint.daemonName = daemonName;
    endpoint.lambda = function () {
        return client.retrieve(resource, endpoint).then((data) => {
            console.log(endpoint.daemonName + ':');
            console.log(data);
            return this.dataRepository.persist(resource.name, endpoint.name, data);
        });
    };
    endpoint.clientType = clientType;
    endpoint.interval = interval;
    this.setupRetrieval(daemonName, interval, endpoint.lambda);
    return endpoint;
};

DataHub.prototype.start = function () {
    Object.keys(this.resources).forEach((resourceName) => {
        var resource = this.resources[resourceName];
        if (resource.endpoints) {
            Object.keys(resource.endpoints).forEach((endpointName) => {
                var endpoint = resource.endpoints[endpointName];
                this.daemons[endpoint.daemonName].start();
            });
        }
    });
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

DataHub.prototype.getResources = function() {
  return JSON.parse(
      JSON.stringify(this.resources,
          (prop, value) => {
              return (prop === 'lambda' ? undefined : value);
          }
      )
  );
};

module.exports.DataHub = DataHub;
