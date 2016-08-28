'use strict';

var loki = require('lokijs');
var collectionName = 'metrics';
var databaseFile = './db/metrics.db';

var loadDBCollection = function(db) {
    var Metrics = db.getCollection(collectionName);
    if ( Metrics === null) {
        Metrics = db.addCollection(collectionName);
    }
    return Metrics;
};

var db = new loki(databaseFile, {
    autoload: true,
    autoloadCallback : function() {
        loadDBCollection(db);
    },
    autosave: true,
    autosaveInterval: 1000
});


function persist(data) {
    var requests = loadDBCollection(db);
    var  result = requests.insert(data);
    return result;
}

function retrieve(jobNo) {
    var requests = loadDBCollection(db);
    var query = {'reqParams.jobNo': parseInt(jobNo)};
    var result = requests.find(query);
    return result;
}

function retrieveAll() {
    var requests = loadDBCollection(db);
    var query = {'processed': false};
    var result = requests.find(query);
    return result;
}


module.exports.persist = persist;
module.exports.retrieve = retrieve;
module.exports.retrieveAll = retrieveAll;
