(function () {
    angular
        .module("RitaApp")
        .factory("DisplayDataService", DisplayDataService);

    function DisplayDataService($http) {

        var service = {
            //getCustomerProfile: getCustomerProfile,
            getCustomerPortfolio: getCustomerPortfolio,
            //getSecurityIndustrySegments: getSecurityIndustrySegments,
            //getCustomerTransactionData: getCustomerTransactionData
        };
        return service;

        function getCustomerPortfolio(callback) {
            $http.get('/rest/customerPortfolio')
                .success(callback)
        }

        /*
        function getCustomerProfile(callback) {
            $http.get('/rest/customerProfile')
                .success(callback);
        }

        
        function getCustomerPortfolio(callback) {
            var responsePromise = $http.get('/rest/customerPortfolio');

            responsePromise.success(function (data, status, headers, config) {
                callback(data);
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("AJAX failed! because no webservice is attached yet");
            });
        }
        

        function getSecurityIndustrySegments(callback) {
            $http.get('/rest/securityIndustrySegments')
                .success(callback);
        }

        function getCustomerTransactionData(callback) {
            $http.get('/rest/customerTransactionData')
                .success(callback);
        }
        */

    }
})();