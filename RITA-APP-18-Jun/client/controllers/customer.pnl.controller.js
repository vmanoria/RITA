(function () {
    angular
        .module("RitaApp")
        .controller("CustomerPnLController", customerPnLController);

    function customerPnLController($scope, DisplayPnLService) {
        $scope.displayPnLReport = displayPnLReport ;

        function displayPnLReport() {

            DisplayPnLService.getPnLReport(function (response) {
                $scope.custPnLReport = response ;
            });
            
        }
        displayPnLReport();


     $scope.getTotal = function(type){
      //type="FRD_TCP";
      if(angular.isDefined($scope.custPnLReport)){  
        var tcpTotal1 = 0 ;     
        var  negativeProfit =0;
        var  temp=0 ;    
      //alert('hi'+$scope.custPnLReport.FRD_TCP);
      angular.forEach($scope.custPnLReport,function(el) {
            
            if(el._id[type] >0) {
            tcpTotal1+=el._id[type] 
            } else { 
            negativeProfit=Math.abs(el._id[type]);
            temp=temp+negativeProfit;
            }
          }
        );
        
        return tcpTotal1-temp ;
      }
     }

    $scope.DateDifference = function(type){
        //type="FRD_TCP" ;
        console.log("Checking Type"+type);
         
     }
    
    }


})();