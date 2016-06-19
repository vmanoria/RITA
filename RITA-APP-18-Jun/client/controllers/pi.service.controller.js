(function () {

    angular
        .module("RitaApp")
        .controller("PersonalityInsightController", personalityInsightController);

    function personalityInsightController($scope, $location, HandlePISevice) {
        $scope.handlePIService = handlePIService;
        $scope.getCustomerInfo = getCustomerInfo;
        $scope.analyze = analyze;

        function getCustomerInfo(customerName) {
            $scope.selectedCustomer = customerName;
            // console.log(customerName);
            $scope.twits = "";
            HandlePISevice.getCustomerTwit(customerName, function (response) {
                console.log(response);
                if (response == "") {
                    $scope.twits = "No Twit for " + customerName;
                    console.log($scope.twits);
                }
                $scope.twits = "No Twit for " + customerName;
                $scope.twits = response;
                //console.log($scope.twits);
            });
        }

        function analyze(custName) {
            // console.log('In analyze', twit);
            HandlePISevice.analyzeTwit(custName, function (response) {

            });

            $location.url('/personalityInsight/' + custName);
        }

        function handlePIService() {

            HandlePISevice.getCustomerList(function (response) {
                $scope.customerList = response;
                $scope.selectedCustomer = "Select Customer";
            });
        }

        handlePIService();
    }
})();