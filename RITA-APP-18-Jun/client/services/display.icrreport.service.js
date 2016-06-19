(function () {
    angular
        .module("RitaApp")
        .factory("DisplayICRService", DisplayICRService);

    function DisplayICRService($http) {

        var service = {
              getICRReport: getICRReport
                   
        }; 
        
        return service;

        function getICRReport(callback) {
            $http.get('/rest/customerICRReport')
                .success(callback)
        }
        
    }
})();