(function () {
    angular
        .module("RitaApp")
        .controller("CustomerRebalancedICRController", customerRebalancedICRController);

    function customerRebalancedICRController($scope, DisplayICRService, DisplayPnLService, AlchemyNewsService) {
        $scope.displayRebalICRReport = displayRebalICRReport;
        $scope.displayRecommendedReports = displayRecommendedReports;
        $scope.getCustomers = getCustomers;
        $scope.custPnLReport = [];
        $scope.recommendedIAR = [];
		$scope.recommendedIARPrev = [];
        $scope.recommendedICR = [];
        $scope.recommendedEAR = [];


        //Methods for Rebalanced report with Bar chart	
        function displayRebalICRReport(customerID) {
			
            DisplayICRService.getRebalICRReport(customerID, function (response) {
                $scope.custRebalICRReport = response;

                $scope.prepareRebalancedICRdata();
                $scope.selectedCustomer = customerID;
            });

        }

        function getCustomers() {
            DisplayICRService.getCustomers(function (response) {
                console.log("getCustomers");
                $scope.customers = response;
                $scope.selectedCustomer = "Select Customer";
            });

        }
        getCustomers();


        function populateIncreamentalInvestment() {
            angular.forEach($scope.custRebalICRReport, function (obj) {
                obj.incrementalInvest = Math.round((obj.originalAllocPercentage - obj.currentAllocPercentage) * $scope.getRebalAllocationTotal());

            });

        }

        $scope.getRebalTcpTotal = function () {
                if (angular.isDefined($scope.custRebalICRReport)) {
                    var tcpTotal = 0;
                    angular.forEach($scope.custRebalICRReport, function (el) {
                        if (el.TCP > 0) {
                            tcpTotal += el.TCP
                        }
                    });

                    return tcpTotal;
                }
            }
            
	$scope.getIncrementalInvestmentTotal=function(){
         if(angular.isDefined($scope.custRebalICRReport)){  
           var investmentTotal = 0 ;     
           angular.forEach($scope.custRebalICRReport,function(el) {
               investmentTotal+=el.incrementalInvest 
              }
           );
           
           return Math.round(investmentTotal);
         }
    }
	
        $scope.getRebalAllocationTotal = function () {
            if (angular.isDefined($scope.custRebalICRReport)) {
                var allocTotal = 0;
                angular.forEach($scope.custRebalICRReport, function (el) {
                    if (el.rebalancedAlloc > 0) {
                        allocTotal += el.rebalancedAlloc
                    }
                });

                return allocTotal;
            }
        }

        $scope.getRebalTcmpTotal = function () {
            if (angular.isDefined($scope.custRebalICRReport)) {
                var tcmpTotal = 0;
                angular.forEach($scope.custRebalICRReport, function (el) {
                    if (el.TCMP > 0) {
                        tcmpTotal += el.TCMP
                    }
                });

                return tcmpTotal;
            }
        }



        function populateSecurityId() {
           
			angular.forEach($scope.recommendedIARPrev, function (obj) {
                angular.forEach($scope.custPnLReport, function (pnlObj) {
					if(obj.TP.indexOf("INR")>=0){
						obj.TP = obj.TP.substring(3);
						obj.TP = obj.TP.replace(",", "");
					}
                    if (pnlObj._id['SecurityID'].toUpperCase() == obj.STOCK.toUpperCase() || pnlObj._id['SecurityName'].toUpperCase() == obj.STOCK.toUpperCase()) {
                        obj.securityName = pnlObj._id['SecurityName'];
						obj.STOCK = pnlObj._id['SecurityID'];
						$scope.recommendedIAR.push(obj);
                    }
                });
            });

            angular.forEach($scope.recommendedEAR, function (obj) {
                angular.forEach($scope.custPnLReport, function (pnlObj) {
                    if (pnlObj._id['SecurityName'] == obj.securityName) {
                        obj.securityID = pnlObj._id['SecurityID'];
                    }
                });
            });
        }




        $scope.prepareRebalancedICRdata = function () {
            $scope.rebalancedDataForChart = [];

            var originalAllocValues = [];
            var currentAllocValues = [];
            var rebalancedAllocValues = [];
            angular.forEach($scope.custRebalICRReport, function (obj) {
                //obj.profitNloss = obj.TCMP - obj.TCP;
                obj.originalAllocPercentage = obj.TCP / $scope.getRebalTcpTotal();
                obj.currentAllocPercentage = obj.TCMP / $scope.getRebalTcmpTotal();
                obj.rebalancedAlloc = Math.round($scope.getRebalTcmpTotal() * obj.originalAllocPercentage);
				
                originalAllocValues.push([obj['_id'].IndustrySegment, obj.TCP/100000]);
                currentAllocValues.push([obj['_id'].IndustrySegment, obj.TCMP/100000]);
                rebalancedAllocValues.push([obj['_id'].IndustrySegment, obj.rebalancedAlloc/100000]);
            });

            $scope.rebalancedDataForChart.push({
                "key": "Original Allocation",
                "values": originalAllocValues
            });
            $scope.rebalancedDataForChart.push({
                "key": "Current Allocation",
                "values": currentAllocValues
            });
            $scope.rebalancedDataForChart.push({
                "key": "Rebalanced Allocation",
                "values": rebalancedAllocValues
            });
            populateIncreamentalInvestment();
        }
        $scope.xMultiBarFunction = function () {
            return function (d) {
                return d[0];
            }
        }
        $scope.yMultiBarFunction = function () {
            return function (d) {
                return d[1];
            }
        }
        var colorArray = ['#FF0000', '#0000FF', '#FFFF00', '#00FFFF'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }

        //Methods for recommended portfolio report
        function displayRecommendedReports(customerID) {
		 $scope.recommendedIAR = [];
            $scope.progress = "Done";
            var securityNames = [];
            $scope.recommendedICR = [];
            DisplayPnLService.getPnLReport(customerID, function (response) {
                $scope.custPnLReport = response;
                angular.forEach($scope.custPnLReport, function (el) {

                    var profitNloss = el._id['FURD_TCP'] - el._id['FRD_TCP'];
                    var originalAllocPercentage = el._id['FRD_TCP'] / $scope.getRecommTcpTotal();
                    var currentAllocPercentage = el._id['FURD_TCP'] / $scope.getRecommTcmpTotal();
                    var rebalancedAlloc = Math.round($scope.getRecommTcmpTotal() * originalAllocPercentage);

                    $scope.recommendedICR.push({
                        "securityID": el._id['SecurityID'],
                        "securityName": el._id['SecurityName'],
                        "currentMarketPrice": el._id['FURD_Avg_CostPrice'],
                        "recommendation": "",
                        "originalAllocPercentage": originalAllocPercentage,
                        "currentAllocPercentage": currentAllocPercentage,
                        "rebalancedAlloc": rebalancedAlloc,
                        "incrementalInvest": "",
                        "recommendation": ""
                    });

                    securityNames.push(el._id['SecurityName']);

                });
                // Calling Alchemy New Service
                handleANService(securityNames);

                populatePortfolioInvestment();
                DisplayICRService.getIARList(securityNames, function (response) {
                    $scope.recommendedIARPrev = response;
                    populateSecurityId();
                });

                DisplayICRService.getEARList(securityNames, function (response) {
                    $scope.recommendedEAR = response;
                    populateSecurityId();
                });

            });

            $scope.selectedCustomer = customerID;


        }

        function populatePortfolioInvestment() {
            angular.forEach($scope.recommendedICR, function (obj) {
                obj.incrementalInvest = Math.round((obj.originalAllocPercentage - obj.currentAllocPercentage) * $scope.getRecommAllocationTotal());
                if (obj.incrementalInvest < 0) {
                    obj.recommendation = "SELL";
                } else {
                    obj.recommendation = "BUY";
                }

            });

        }

        $scope.getRecommTcpTotal = function () {
            if (angular.isDefined($scope.custPnLReport)) {
                var tcpTotal = 0;
                angular.forEach($scope.custPnLReport, function (el) {
                    if (el._id['FRD_TCP'] > 0) {
                        tcpTotal += el._id['FRD_TCP'];
                    }
                });

                return tcpTotal;
            }
        }

        $scope.getRecommTcmpTotal = function () {
                if (angular.isDefined($scope.custPnLReport)) {
                    var tcmpTotal = 0;
                    angular.forEach($scope.custPnLReport, function (el) {
                        if (el._id['FURD_TCP'] > 0) {
                            tcmpTotal += el._id['FURD_TCP'];
                        }
                    });

                    return tcmpTotal;
                }
            }
    
        $scope.getRecommAllocationTotal = function () {
            if (angular.isDefined($scope.recommendedICR)) {
                var allocTotal = 0;
                angular.forEach($scope.recommendedICR, function (el) {
                    if (el.rebalancedAlloc > 0) {
                        allocTotal += el.rebalancedAlloc
                    }
                });

                return allocTotal;
            }
        }


        function handleANService(securityNames) {
            $scope.news = "Getting News...";
            $scope.data = "Getting Data...";

            AlchemyNewsService.getAlchemyNewsURLs(securityNames, function (response) {
                //console.log('response', response);
                if (response.status == 'ERROR')
                    $scope.err = response.statusInfo;
                else
                    $scope.urls = response.result['docs'];
                $scope.news = "";
                $scope.data = "";
                $scope.progress = "Done";
                //console.log('in getAlchemyController', $scope.urls);
            });
        }
        //handleANService();


    }
})();