(function () {
    angular
        .module("RitaApp")
        .controller("CustomerICRController", customerICRController);

    function customerICRController($scope, DisplayICRService) {
        $scope.displayICRReport = displayICRReport ;

        function displayICRReport() {

            DisplayICRService.getICRReport(function (response) {
                $scope.custICRReport = response ;
            });
            
        }
     displayICRReport();
     $scope.getTcpTotal = function(type){
         if(angular.isDefined($scope.custICRReport)){  
           var tcpTotal = 0 ;     
           angular.forEach($scope.custICRReport,function(el) {
               if(el.TCP >0){
               tcpTotal+=el.TCP 
               }
             }
           );
           
           return tcpTotal ;
         }
        }
     
     $scope.getTcmpTotal = function(type){
         if(angular.isDefined($scope.custICRReport)){  
           var tcmpTotal = 0 ;     
           angular.forEach($scope.custICRReport,function(el) {
               if(el.TCP >0){
            	   tcmpTotal+=el.TCMP 
               }
             }
           );
           
           return tcmpTotal ;
         }
        }


     /*$scope.getTotal = function(type){
      //type="FRD_TCP";
      if(angular.isDefined($scope.custICRReport)){  
        var tcpTotal1 = 0 ;     
        var  negativeProfit =0;
        var  temp=0 ;    
       angular.forEach($scope.custICRReport,function(el) {
            
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
     }*/
   } 
})();