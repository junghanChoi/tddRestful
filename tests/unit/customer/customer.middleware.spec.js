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
    });

    describe('getCustomers', function(){
        var fetchCustomers, fetchCustomersPromise, expectedCustomers, expectedError;

        beforeEach(function(){
            fetchCustomers = sinon.stub(CustomerService, 'fetchCustomers');
            req.body = {};
        });
        afterEach(function(){
            fetchCustomers.restore();
        });

        it('should successfully get all customers', function(){
            expectedCustomers = CustomerFixture.customers;// 이전거 활용

            fetchCustomersPromise = Promise.resolve(expectedCustomers); //해당 객체를 반환하는 프로미스 생성
            fetchCustomers.returns(fetchCustomersPromise); //이 프로미스를 반환해야 한다.

            CustomerMiddleware.getCustomers(req, res, next); // 미들웨어 실행
            sinon.assert.callCount(fetchCustomers, 1); //콜 카운트

            return fetchCustomersPromise.then(function(){
                expect(req.response).to.be.a('array'); //응답은 배열로, 길이도 같고, 내용이 같아야 함.
                expect(req.response.length).to.equal(expectedCustomers.length);
                expect(req.response).to.deep.equal(expectedCustomers);
                sinon.assert.callCount(next,1); // next call count도 확인.
            })
        });

        it('should throw error while getting all customers', function(){
            expectedError = ErrorFixture.unknownError;

            fetchCustomersPromise = Promise.reject(expectedError);
            fetchCustomers.returns(fetchCustomersPromise);

            CustomerMiddleware.getCustomers(req,res, next);
            sinon.assert.callCount(fetchCustomers, 1);
            return fetchCustomersPromise.catch(function (error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        })
    });

    describe('getCustomerById', function(){
        var fetchCustomerById, fetchCustomerByIdPromise, expectedCustomer, expectedError;
        beforeEach(function(){
            fetchCustomerById = sinon.stub(CustomerService, 'fetchCustomerById');
        });
        afterEach(function(){
            fetchCustomerById.restore();
        });
        it('should successfully fetch the customer by id', function(){
            expectedCustomer = CustomerFixture.createdCustomer;
            fetchCustomerByIdPromise = Promise.resolve(expectedCustomer);
            //아래 문장까지가 설정. 스텁이 파라미터를 갖고, 아래 프로미스를 반환해야 한다.
            fetchCustomerById.withArgs(req.params.CustomerId).returns(fetchCustomerByIdPromise);
            // 실제 호출
            CustomerMiddleware.getCustomerById(req, res, next);
            sinon.assert.callCount(fetchCustomerById, 1);

            return fetchCustomerByIdPromise.then(function(){
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedCustomer);
                sinon.assert.callCount(next, 1);
            });
        });
        it('should throw error while getting customer by id', function(){
            expectedError = ErrorFixture.unknownError;
            fetchCustomerByIdPromise = Promise.reject(expectedError);

            fetchCustomerById.withArgs(req.params.CustomerId).returns(fetchCustomerByIdPromise);

            CustomerMiddleware.getCustomerById(req, res, next);

            sinon.assert.callCount(fetchCustomerById, 1);
            return fetchCustomerByIdPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    })
})