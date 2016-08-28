'use strict';
var chai = require('chai');
var should = chai.should();
var Resource = require('../lib/Resource');
var resource = new Resource('resource', {}, {});

describe('Resource', () => {
    describe('#add, find and remove endpoints()', () => {

        it('should add, find and remove endpoints', () => {
            resource.addEndpoint('test',  'endpoint', 5);
            var endpoint = {collection: 'test', endpoint: 'endpoint', interval: 5};
            resource.endpoints['test'].should.deep.equal(endpoint);
            resource.findEndpoint('test').should.deep.equal(endpoint);
            resource.removeEndpoint('test');
            should.not.exist(resource.findEndpoint('test'));
        });

    });
});

