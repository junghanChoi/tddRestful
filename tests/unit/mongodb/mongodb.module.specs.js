var chai = require('chai');
var expect = chai.expect;
var MongoDBModule = require('../../../modules/mongodb/mongodb.module')

//a bunch of tests can be grouped into a single test suite to run them all at once.
//name, tests function.
//nested describe blocks is possible.
/*
describe('Can be a file/function/module name', function(){
    //specs. the behavior of the main file
    //to confirm the expected behavior.
    it(`should describe the test and it's expectation`, function(){
        //expect(SomeModule).to.be.a('object');
    });
});*/


describe('MongoDBModule', function(){
    
    describe('mongodb.module file',
    function(){

        it('should read the mongodb.module file',
        function(){
            expect(MongoDBModule).to.be.a('object');
        });

        it('should confirm MongoDBUtil exist',
        function(){
            expect(MongoDBModule.MongoDBUtil).to.be.a('object');
        })
    });
});