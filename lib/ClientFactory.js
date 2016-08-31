'use strict';

function ClientFactory() {
    this.clients = {};
    this.defaultClient = 'http-json';
}
ClientFactory.prototype.getClient = function(clientType, resource, endpoint){
    var client;
    if (clientType && this.clients[clientType]) {
        client =  this.clients[clientType]
    } else {
        client = this. clients[this.defaultClient];
    }
    if (client) {
        console.log(client);
        return client.create(resource, endpoint);
    } else {
        throw new Error("Unknown clientType: " + clientType)
    }

};
ClientFactory.prototype.addClientTypeFactory = function(clientType, client, isDefault=false){
    this.clients[clientType] = client;
    if (isDefault) {
     this.defaultClient = clientType;
    }
};

module.exports = function() {
    return new ClientFactory();
};