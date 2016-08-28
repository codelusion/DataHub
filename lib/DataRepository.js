'use strict';

function DataRepository() {
}

DataRepository.prototype.initResource = function(resourceName){};
DataRepository.prototype.initResourceCollection = function(resourceName, collectionName){};
DataRepository.prototype.deleteResource = function(resource){};
DataRepository.prototype.persist = function(resourceName, collectionName,data){};