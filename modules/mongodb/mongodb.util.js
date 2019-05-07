//mongoDB connection creation functional code
(function(){
    'use strict';
    module.exports = {
        init: init
    };
    var mongoose = require('mongoose');
    var mongodbConfig = require('../../config/mongodb/mongodb-config').mongodb;

    /**
     * call mongoose.connect function to handle the promise functions
     * for both success and failure
     */
    function init(){
        var options = {
            promiseLibrary: require('bluebird'),
            useNewUrlParser: true
        };

        var connectionString = prepareConnectionString(mongodbConfig);
        mongoose.connect(connectionString, options)
            .then(function(result){
                console.log("MongoDB connection successful. DB: " + connectionString);
            })
            .catch(function(error){
                console.log(error.message);
                console.log("Error occured while connecting to DB : "+ connectionString);
        });
    };

    /**
     * For preparing the connection URI from the configuration json file.
     */
    function
    prepareConnectionString(config){
        var connectionString = 'mongodb://';

        if(config.user){
            connectionString += config.user + ':' + config.password + '@';
        }

        connectionString += config.server + '/' + config.database;

        return connectionString;
    }


})();