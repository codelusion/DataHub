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
        autoload: false,
        autosave: true,
        autosaveInterval: 10000 //save every 10s
    }
}

util.inherits(LokiDataRepository, DataRepository);

LokiDataRepository.prototype.initResource = function (resourceName) {
    if (resourceName && resourceName === sanitize(resourceName)) {
        var db = new Loki(path.join(this.baseDir, resourceName + this.ext), this.loadOptions);
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

LokiDataRepository.prototype.deleteResource = function (resourceName) {
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

LokiDataRepository.prototype.loadFiles = function () {
    this.initBaseDir();
    sh.ls(path.join(this.baseDir, '/*', this.ext)).forEach((filename) => {
        var resourceName = path.basename(filename).replace(this.ext, '');
        this.resources[resourceName] = new Loki(filename, this.loadOptions)
    });
};

LokiDataRepository.prototype.initBaseDir = function () {
    if (!sh.test('-d', this.baseDir)) {
        sh.mkdir('-p', this.baseDir);
    }
};

module.exports = function(baseDir) {
    return new LokiDataRepository(baseDir);
};