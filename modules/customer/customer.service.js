(function(){
    'use strict';
    
    module.exports = {
        createCustomer: createCustomer,
        fetchCustomers: fetchCustomers,
        fetchCustomerById : fetchCustomerById
    };

    var CustomerModel = require('./customer.module')().CustomerModel;
    
    function createCustomer(customer){
        return CustomerModel.create(customer);
    };
    function fetchCustomers(){
        return CustomerModel.find({}).exec();
    }
    // mongoosejs.com/doc/api.html#model_Model.findById
    function fetchCustomerById(customerId){
        return CustomerModel.findById(customerId).exec();
    }

})();