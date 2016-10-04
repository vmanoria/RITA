(function () {
    angular
        .module("RitaApp")
        .config(Configure);

    function Configure($routeProvider) {
        $routeProvider
            .when("/about", {
                templateUrl: "about.html"
            })
            .when("/customerInputView", {
                templateUrl: "customerInputView.html",
                controller: "CustomerInputController"
            })
              .when("/inputPI",{
                templateUrl: "inputPersonality.html",
                controller: "PersonalityInsightController"
            })
            .when('/customerPnLReport',{
               templateUrl: '/customerpnlreport.html',
               controller: 'CustomerPnLController'
            })
            .when('/customerICRReport',{
               templateUrl: '/customericreport.html',
               controller: 'CustomerICRController'
            })
             .when('/customerRebalancedICRReport',{
               templateUrl: '/customerrebalancedicrreport.html',
               controller: 'CustomerRebalancedICRController'
            })
             .when('/recommendedPortfolio',{
               templateUrl: '/recommendedPortfolio.html',
               controller: 'CustomerRebalancedICRController'
            })
			.when('/fileUpload',{
               templateUrl: '/fileUpload.html',
               controller: 'FileUploadController'
            })
			.otherwise({
                redirectTo: "/about"
            });
    }
})();