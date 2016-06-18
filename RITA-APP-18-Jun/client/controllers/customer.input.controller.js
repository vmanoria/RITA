(function () {
    angular
        .module("RitaApp")
        .controller("CustomerInputController", customerInputController);

    function customerInputController($scope, DisplayDataService) {
        $scope.displayInput = displayInput;

        function displayInput() {

            DisplayDataService.getCustomerPortfolio(function (response){
                $scope.custPortfolios = response;
            });
            /*
            DisplayDataService.getCustomerProfile(function (response) {
                $scope.custProfiles = response;
            });



            DisplayDataService.getSecurityIndustrySegments(function (response) {
                $scope.securityIndustrySegs = response;
                //console.log($scope.securityIndustrySeg);
            });

            DisplayDataService.getCustomerTransactionData(function (response) {
                $scope.custTrans = response;
                console.log($scope.securityIndustrySeg);
            });
            */
        }
        displayInput();
    }
})();