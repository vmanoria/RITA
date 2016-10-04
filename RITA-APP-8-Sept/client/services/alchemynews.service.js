(function () {
    angular
        .module("RitaApp")
        .factory("AlchemyNewsService", alchemyNewsService);

    function alchemyNewsService($http) {

        var service = {
            getAlchemyNewsURLs: getAlchemyNewsURLs,
        };
        return service;

        function getAlchemyNewsURLs(securityNames, callback) {
            $http.get('/rest/alchemynewsurls/' + securityNames)
                .success(callback)
        }
    }
})();