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

     $scope.getDateDifference = function(){
        var frdDate="FRD" ;
        var furdDate="FURD";
        var frdDate1;
        var furdDate1 ;
        var ONE_DAY = 1000 * 60 * 60 * 24;
        var  temp ;
      //type="FRD_TCP";
      if(angular.isDefined($scope.custPnLReport)){  
              //alert('hi'+$scope.custPnLReport.FRD_TCP);
            angular.forEach($scope.custPnLReport,function(el) {
            frdDate1 =el._id[frdDate];
            frudDate1 =el._id[furdDate];
             var date1_ms = new Date(frdDate1).getTime();
             var date2_ms = new Date(frudDate1).getTime();
             var difference_ms = Math.abs(date1_ms - date2_ms);
             temp=Math.round(difference_ms/ONE_DAY);

             }
        );
        
        return temp ;
      }
     }

     /*$scope.exampleData = [
          { key: "One", y: 5 },
          { key: "Two", y: 2 },
          { key: "Three", y: 9 },
          { key: "Four", y: 7 },
          { key: "Five", y: 4 },
          { key: "Six", y: 3 },
         { key: "Seven", y: 9 }
     ];*/
    
    }


})();