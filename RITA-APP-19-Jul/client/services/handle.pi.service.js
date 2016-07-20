(function () {
    angular
        .module("RitaApp")
        .factory("HandlePISevice", HandlePISevice);

    function HandlePISevice($http) {

        var service = {
            getCustomerList: getCustomerList,
            getCustomerTwit: getCustomerTwit,
            analyzeTwit: analyzeTwit

        };
        return service;

        function getCustomerList(callback) {
            $http.get('/rest/customerlist')
                .success(callback)
        }

        function getCustomerTwit(customerName, callback) {
            //console.log(customerName);
            $http.get('/rest/customertwit/' + customerName)
                .success(callback)
        }

        function analyzeTwit(customerName, callback) {
            //console.log('in analyzeTwit', twit);
            $http.post('/rest/analyzetwit/' + customerName)
                .success(callback)
        }


    }
})();