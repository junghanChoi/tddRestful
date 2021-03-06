'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http'); //http plug-in
chai.use(chaiHttp);

var expect = chai.expect;
var request = chai.request;

// express application.
var app = require('../../app');

var Fixtures = require('../fixtures/fixtures')
var CustomerFixture = Fixtures.CustomerFixture;

var baseUri = '/customers';

var testData = {
    existingCustomer: {},
    modifiedCustomer: CustomerFixture.modifiedCustomer
}

describe('CustomerController', function(){
    // to create a new customer, use POST method
    describe("POST " + baseUri, function(){
        it('should add new customer', function(done){
            request(app)
            .post(baseUri)
            .send(CustomerFixture.newCustomer)
            .end(function(err, res){ // end function wait to finish request.
                expect(res.status).to.equal(201); // success
                expect(res.body).to.not.equal({});
                expect(res.body._id).to.not.equal(undefined);
                expect(res.body.firstName).to.equal(CustomerFixture.createdCustomer.firstName);

                done();
            });
        });
    });

    describe('GET ' + baseUri, function(){
        it('should get all customers', function(done){
            request(app)
            .get(baseUri)
            .end(function (err, res){
                expect(res.status).to.equal(200);
                expect(res.body).to.not.equal(undefined);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.not.equal(0);

                testData.existingCustomer = res.body[0];

                done();
            })
        })
    });

    describe('GET' + baseUri + '/:customerId', function(){
        it('should get a customer by id', function(done){
            request(app)
            .get(baseUri + '/' + testData.existingCustomer._id)
            .end(function(err, res){
                expect(res.status).to.equal(200);
                expect(res.body).to.not.equal(undefined);
                expect(res.body).to.deep.equal(testData.existingCustomer);
                expect(res.body.firstName).to.equal(testData.existingCustomer.firstName);

                done();
            });
        });
    });

    describe('PUT' + baseUri + '/:customerId', function(){
        it('should modify existing customer', function(done){
            testData.modifiedCustomer._id = testData.existingCustomer._id;

            request(app)
            .put(baseUri + '/' + testData.modifiedCustomer._id)
            .send(testData.modifiedCustomer)
            .end(function(err, res){
                expect(res.status).to.equal(200);
                expect(res.body).to.not.equal(undefined);
                expect(res.body.firstName).to.equal(testData.modifiedCustomer.firstName);
                expect(res.body.address).to.equal(testData.modifiedCustomer.address);

                done();
            })
        });
    });
    describe('DELETE' + baseUri + '/:customerId', function(){
        it('should remove an existing customer', function(done){
            request(app)
            .delete(baseUri + '/' + testData.existingCustomer._id)
            .end(function(err, res){
                expect(res.status).to.equal(200);
                expect(res.body.firstName).to.not.equal(undefined);
                expect(res.body.firstName).to.equal(testData.existingCustomer.firstName);

                done();
            });
        })
    })
})
