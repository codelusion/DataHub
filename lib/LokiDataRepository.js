'use strict';

var util = require('util');
var DataRepository = require('./DataRepository');
var Loki = require('lokijs');
var path = require('path');
var sh = require('shelljs');
var sanitize = require('sanitize-filename');

function LokiDataRepository(baseDir) {
    this.baseDir = baseDir || path.join(__dirname, './../db');
    this.resources = {};
    this.ext = '.json';
    this.loadOptions = {
        autoload: true,
        autosave: true,
        autosaveInterval: 10000 //10s
    }
}

util.extends(LokiDataRepository, DataRepository);

LokiDataRepository.prototype.initResource = function (resourceName) {
    if (resourceName === sanitize(resourceName)) {
        var db = new Loki(path.join(this.baseDir, resourceName, this.ext));
        db.saveDatabase();
        this.resources[resourceName] = db;
    } else {
        throw new Error('Invalid resourceName: ' + resourceName);
    }
};
LokiDataRepository.prototype.initResourceCollection = function (resourceName, collectionName) {
    var db = this.resources[resourceName];
    if (db) {
        if (resourceName === sanitize(resourceName)) {
            var collection = db.getCollection(collectionName);
            if (!collection) {
                db.addCollection(collectionName);
                db.saveDatabase();
            }
        } else {
            throw new Error('Invalid collection name: ' + collectionName);
        }
    } else {
        throw new Error('invalid resource name: ' + resourceName);
    }
};

LokiDataRepository.prototype.deleteResource = function (resource) {
    var db = this.resources[resourceName];
    db.deleteDatabase();
};

LokiDataRepository.prototype.persist = function (resourceName, collectionName, data) {
    var db = this.resources[resourceName];
    if (db) {
        var collection = db.getCollection(collectionName);
        if (collection) {
            return collection.insert(data);
        } else {
            throw new Error("unknown collection: " + collectionName + ' in resource: ' + resourceName);
        }
    } else {
        throw new Error("unknown resource: " + resourceName);
    }
};

LokiDataRepository.prototype.init = function () {
    var self = this;
    if (fs.existsSync(this.baseDir)) {
        sh.ls(path.join(this.baseDir, '/*', this.ext)).forEach((filename) => {
            var resourceName = path.basename(filename).replace(this.ext, '');
            this.resources[resourceName] = new Loki(filename, this.loadOptions)
        });
    } else {
        sh.mkdir('-p', this.baseDir);
    }

};