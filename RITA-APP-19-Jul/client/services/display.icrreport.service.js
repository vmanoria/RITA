(function () {
    angular
        .module("RitaApp")
        .factory("DisplayICRService", DisplayICRService);

    function DisplayICRService($http) {

        var service = {
              getICRReport: getICRReport,
              getCustomers:getCustomers,
              getRebalICRReport: getRebalICRReport,
              getIARList: getIARList,
              getEARList: getEARList

                   
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
        function getRebalICRReport(customerID,callback) {
            $http.get('/rest/customerRebalICRReport/'+customerID)
                .success(callback)
        }
        function getIARList(listOfSecurities,callback) {
            $http.get('/rest/customerIARReport/'+listOfSecurities)
                .success(callback)
        }
                                
        function getEARList(listOfSecurities,callback) {
            $http.get('/rest/customerEARReport/'+listOfSecurities)
                .success(callback)
        }



        
    }
})();