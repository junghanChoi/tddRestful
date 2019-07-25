'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var httpMocks = require('node-mocks-http'); // http object mock
var bluebird = require('bluebird'); // Stub 
var Promise = bluebird.Promise;

// load variables under test.
var CustomerModule = require('../../../modules/customer/customer.module')();// why calling?
var CustomerMiddleware = CustomerModule.CustomerMiddleware;
var CustomerService = CustomerModule.CustomerService;

var Fixtures = require('../../fixtures/fixtures');
var CustomerFixture = Fixtures.CustomerFixture;
var ErrorFixture = Fixtures.ErrorFixture;

var req, res, next;


describe('CustomerMiddleware', function(){
    beforeEach(function(){
        req = httpMocks.createRequest();
        res = httpMocks.createRequest();
        next = sinon.spy();
    });

    describe('addCustomer', function(){
        var createCustomer, createCustomerPromise, expectedCreatedCustomer, expectedError;
        beforeEach(function(){
            createCustomer = sinon.stub(CustomerService, 'createCustomer');
            req.body = CustomerFixture.newCustomer;
        });
        afterEach(function(){
            createCustomer.restore();
        });

        it('should successfully create new customer', function(){
            expectedCreatedCustomer = CustomerFixture.createdCustomer;
            createCustomerPromise = Promise.resolve(expectedCreatedCustomer);// 프로미스가 해당 변수 반환해야 함.
            
            createCustomer.withArgs(req.body).returns(createCustomerPromise);
            CustomerMiddleware.addCustomer(req, res, next);

            sinon.assert.callCount(createCustomer, 1);

            return createCustomerPromise.then(function(){
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedCreatedCustomer);
                sinon.assert.callCount(next, 1);
            })
        })
        
        // failure test case
        it('should throw error while creating the new customer', function(){
            expectedError = ErrorFixture.unknownError;

            createCustomerPromise = Promise.reject(expectedError);
            createCustomer.withArgs(req.body).returns(createCustomerPromise);

            CustomerMiddleware.addCustomer(req,res,next);

            sinon.assert.callCount(createCustomer, 1);
            return createCustomerPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    })
})