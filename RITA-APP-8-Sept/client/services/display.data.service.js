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

    }
})();