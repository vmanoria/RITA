(function () {
    //var _ = reuqire("underscore") ;
    angular
        .module("RitaApp")
        .controller("PersonalityInsightController", personalityInsightController);

    function personalityInsightController($scope, $location, HandlePISevice) {
        var globalState = {
            twitterUserId: undefined,
            selectedTwitterUser: undefined,
            selectedTwitterImage: undefined,
            selectedTwitterUserLang: undefined,
            selectedSample: undefined,
            languageSelected: undefined,
            currentProfile: undefined,
            userLocale: undefined
        };
        $scope.handlePIService = handlePIService;
        $scope.getCustomerInfo = getCustomerInfo;
        $scope.analyze = analyze;

        function getCustomerInfo(customer) {
            //$scope.selectedCustomer = customerName;
            //console.log(customerName);
            $scope.twits = "";
            HandlePISevice.getCustomerTwit(customer.CustomerName, function (response) {
                //console.log(response);
                if (response == "") {
                    $scope.twits = "No Twit for " + customer.CustomerName;
                    console.log($scope.twits);
                }
                $scope.twits = "No Twit for " + customer.CustomerName;
                $scope.twits = assembleTextSummary(response);
				
                console.log($scope.twits);
            });
        }
		
        function analyze(customer, callback) {
			getCustomerInfo(customer); 
            //console.log('In analyze', twits);
            $scope.selectedCustomer = customer.CustomerName;
            $scope.PhotoFile = customer.PhotoFile;
            $scope.CustomerID = customer.CustomerID;
            $scope.DateOfBirth = customer.DateOfBirth;
            $scope.City = customer.City;
            $scope.MaritalStatus = customer.MaritalStatus;
            $scope.RiskType = customer.RiskType;

            $scope.message = "Getting Personality Insight of ";
            $scope.dots = "...";
            $scope.progress = "";
            HandlePISevice.analyzeTwit(customer.CustomerName, function (response) {
                var summary = setTextSummary(response, globalState.userLocale || 'en');
                $scope.summary = assembleTextSummary(summary).split('.');
                $scope.summary = $scope.summary + '\n\n' + '<b> ' + $scope.RiskType + ' </b>';

                $scope.message = "";
                $scope.progress = "Done";
            });

        }

        function handlePIService() {

            HandlePISevice.getCustomerList(function (response) {
                $scope.customerList = response;
                $scope.selectedCustomer = "Select Customer";
            });
        }

        handlePIService();

        function assembleTextSummary(text) {
            return '<p align="justify">' + text.split('\n').join('</p><p align="justify">') + '</p>';
        }

        function setTextSummary(profile, locale) {

            var textSummary = new TextSummary(locale),
                data = changeProfileLabels(profile),
                summary = textSummary.getSummary(profile);
            return summary;
        }

        function changeProfileLabels(data) {
            var clonned = JSON.parse(JSON.stringify(data)),
                replacements = replacementsForLang(globalState.userLocale || 'en' || 'en');

            function walkTree(f, tree) {
                f(tree);
                if (tree.children) {
                    tree.children.forEach(walkTree.bind(this, f));
                }
            }

            walkTree(function (node) {
                if (node.id && replacements[node.id.replace('_parent', '')]) {
                    node.name = replacements[node.id.replace('_parent', '')];
                }
            }, clonned.tree);

            return clonned;
        }

        function replacementsForLang(lang) {
            var replacements = {
                'en': {
                    'Extraversion': 'Introversion/Extraversion',
                    'Outgoing': 'Warmth',
                    'Uncompromising': 'Straightforwardness',
                    'Immoderation': 'Impulsiveness',
                    'Susceptible to stress': 'Sensitivity to stress',
                    'Conservation': 'Tradition',
                    'Openness to change': 'Stimulation',
                    'Hedonism': 'Taking pleasure in life',
                    'Self-enhancement': 'Achievement',
                    'Self-transcendence': 'Helping others'
                }
            };

            return replacements[lang] || {};
        }
    }
})();