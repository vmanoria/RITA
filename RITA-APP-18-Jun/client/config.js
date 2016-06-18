(function () {
    angular
        .module("RitaApp")
        .config(Configure);

    function Configure($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "home.html"
            })
            .when("/customerInputView", {
                templateUrl: "customerInputView.html",
                controller: "CustomerInputController"
            })
            .when("/personalityInsight", {
                templateUrl: "showPersonality.html"
            })
            .when('/customerPnLReport',{
               templateUrl: '/customerpnlreport.html',
               controller: 'CustomerPnLController'
            })
            .otherwise({
                redirectTo: "/home"
            });
    }
})();