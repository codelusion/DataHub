'use strict';

function Client(clientType, clientImplementation) {
    this.clientType = clientType;
    this.clientImpl = clientImplementation;
}
Client.prototype.retrieve = function(resource, endpoint){
    this.clientImpl(resource, endpoint);
};

