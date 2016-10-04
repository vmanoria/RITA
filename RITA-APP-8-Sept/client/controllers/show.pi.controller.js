(function () {

    angular
        .module("RitaApp")
        .controller("ShowPersonalityInsightController", showPersonalityInsightController);

    function showPersonalityInsightController($scope, $location, HandlePISevice) {
        $scope.showPIResults = showPIResults;

        function showPIResults($location) {
            $scope.customerName = $location;
            console.log('customerName', customerName);
        }
        showPIResults();
    }
    
})();