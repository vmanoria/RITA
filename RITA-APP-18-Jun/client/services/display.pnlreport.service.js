(function () {
    angular
        .module("RitaApp")
        .factory("DisplayPnLService", DisplayPnLService);

    function DisplayPnLService($http) {

        var service = {
              getPnLReport: getPnLReport,
              getCustomers:getCustomers
                       
        };
        return service;

        function getPnLReport(customerID,callback) {
            console.log("CustomerID  in Client Service"+customerID)
            $http.get('/rest/customerPnLReport/'+customerID)
                .success(callback)
        }
        
        function getCustomers(callback) {
            $http.get('/rest/customers')
                .success(callback)
        }

        
    }
})();