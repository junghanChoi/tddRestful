//Immediately Invoked Fucntion Expression (IIFE)
(function(){
    'use strict';
    module.exports = {
        // declare attributes here to be exposed to other modules
        MongoDBUtil: require('./mongodb.util') 
    };
})();