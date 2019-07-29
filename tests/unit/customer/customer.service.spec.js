'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
require('sinon-mongoose')

var mongoose = require('mongoose');
// CustomerModule is mocked.
var CustomerModule = require('../../../modules/customer/customer.module')();
var CustomerModel = CustomerModule.CustomerModel;
var CustomerService = CustomerModule.CustomerService;

var Fixtures = require('../../fixtures/fixtures');
var CustomerFixture = Fixtures.CustomerFixture;
var ErrorFixture = Fixtures.ErrorFixture;

var CustomerModelMock;


describe('CustomerService',function(){
    beforeEach(function(){
        CustomerModelMock = sinon.mock(CustomerModel);
    });
    afterEach(function(){
        CustomerModelMock.restore();
        mongoose.model = {};
        mongoose.modelSchemas = {};

        return mongoose.connection.close();
    })

    //We are mocking create function
    describe('createCustomer', function(){
        var newCustomer, expectedError, expectedCreatedCustomer;
        it('should successfully create new customer', function(){
            newCustomer = CustomerFixture.newCustomer;
            expectedCreatedCustomer = CustomerFixture.createdCustomer;
            
            CustomerModelMock.expects('create')
            .withArgs(newCustomer)
            .resolves(expectedCreatedCustomer);

            return CustomerService.createCustomer(newCustomer)
                .then(function(data){
                    CustomerModelMock.verify();
                    expect(data).to.deep.equal(expectedCreatedCustomer);
                });
        });

        it('should throw error while creating customer', function(){
            expectedError = ErrorFixture.unknownError;
            newCustomer = CustomerFixture.newCustomer;

            CustomerModelMock.expects('create')
            .withArgs(newCustomer)
            .rejects(expectedError);

            return CustomerService.createCustomer(newCustomer).catch(function(error){
                CustomerModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        })
    });

    // fetchCustomers
    describe('fetchCustoers', function(){
        var expectedCustomers, expectedError;
        it('should successfully fetch all customers', function(){
            // setting up expected response
            expectedCustomers = CustomerFixture.customers;
            //mocking behavior of the dependencies 
            CustomerModelMock.expects('find') //mongoose model's method. find, exec.
            .withArgs({})
            .chain('exec')// return a promise. 
            .resolves(expectedCustomers);

            // invoking the method
            return CustomerService.fetchCustomers()
            .then(function(data){
                CustomerModelMock.verify();
                expect(data).to.deep.equal(expectedCustomers);
            });
        });
        it('should throw error while fetching all customers', function(){
            expectedError = ErrorFixture.unknownError;

            CustomerModelMock.expects('find')
            .withArgs({})
            .chain('exec')
            .rejects(expectedError);

            return CustomerService.fetchCustomers()
            .catch(function(error){
                CustomerModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
});