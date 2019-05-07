var chai = require('chai');
var expect = chai.expect;

// import via mongodb module
var MongoDBUtil = require('../../../modules/mongodb/mongodb.module').MongoDBUtil;

describe('MongoDBUtil', function(){

    describe('mongodb.util file',
     function(){

        it('should read the mongodb.module file',
        function(){
            expect(MongoDBUtil).to.be.a('object');
        })
        it('should confirm init function exist',
        function(){
            expect(MongoDBUtil.init).to.be.a('function');
        })
    });
});