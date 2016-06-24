(function () {
    angular
        .module("RitaApp")
        .factory("DisplayICRService", DisplayICRService);

    function DisplayICRService($http) {

        var service = {
              getICRReport: getICRReport,
              getCustomers:getCustomers
                   
        }; 
        
        return service;

        function getICRReport(customerID,callback) {
            $http.get('/rest/customerICRReport/'+customerID)
                .success(callback)
        }
        
        function getCustomers(callback) {
            $http.get('/rest/customers')
                .success(callback)
        }
        
    }
})();