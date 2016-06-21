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
            .when("/personalityInsight/:custName", {
                templateUrl: "showPersonality.html",
		        controller: "ShowPersonalityInsightController"
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
            .otherwise({
                redirectTo: "/about"
            });
    }
})();