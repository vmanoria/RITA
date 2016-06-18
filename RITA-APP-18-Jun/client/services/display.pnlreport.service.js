(function () {
    angular
        .module("RitaApp")
        .factory("DisplayPnLService", DisplayPnLService);

    function DisplayPnLService($http) {

        var service = {
              getPnLReport: getPnLReport
                   
        };
        return service;

        function getPnLReport(callback) {
            $http.get('/rest/customerPnLReport')
                .success(callback)
        }

        
    }
})();