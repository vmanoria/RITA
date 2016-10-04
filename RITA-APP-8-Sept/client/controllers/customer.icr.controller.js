(function () {
    angular
        .module("RitaApp")
        .controller("CustomerICRController", customerICRController);

    function customerICRController($scope, DisplayICRService) {
        $scope.displayICRReport = displayICRReport ;
        $scope.getCustomers = getCustomers ;
                

        function displayICRReport(customerID,customerName) {

            DisplayICRService.getICRReport(customerID,function (response) {
                $scope.custICRReport = response ; 
                $scope.prepareBarhartICRdata();
                $scope.selectedCustomer =customerName;
            });
            
        }
        
        function getCustomers(){
            DisplayICRService.getCustomers(function (response) { 
              console.log("getCustomers");
              $scope.customers = response;
              $scope.selectedCustomer = "Select Customer";
          });

       }
     getCustomers();   
     
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
               if(el.TCMP >0){
            	   tcmpTotal+=el.TCMP 
               }
             }
           );
           
           return tcmpTotal ;
         }
        }

         $scope.prepareBarGraph=function() { 
          console.log("Inside prepareGraphParameter"); 

          $scope.graphArray   =[] ; 
          var  originalallocationObj = {}; 
          var  currentallocationObj  = {}; 
          var  originalAllocationData =[] ; 
          var  currentAllocationData  =[] ;
          var  industryData  =[] ;  
             
          if(angular.isDefined($scope.custICRReport)) {  
            angular.forEach($scope.custICRReport,function(el) {
                      
                var  tcptotal = $scope.getTcpTotal('TCP');  
                var  tcmptotal = $scope.getTcmpTotal('TCMP');  
                var  originalallocation = (el.TCP/tcptotal)*100 ;
                var  currentallocation = (el.TCMP/tcmptotal)*100 ;
                originalallocationObj.key  = "Original Allocation"; 

                
                //currentallocationObj.key ="Current Allocation"; 

                var  originalvalues =[] ; 
                
                var  industrySegmentval =el._id['IndustrySegment'];
                var  jsonVariable =[] ;
                jsonVariable[industrySegmentval]=currentallocation ;
                industryData.push(jsonVariable);
                
                
            });
              originalAllocationData.push(industryData);
              console.log(originalAllocationData);
              originalallocationObj.values =originalAllocationData ;
              $scope.graphArray.push(originalallocationObj);
              console.log($scope.graphArray);
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
      $scope.prepareBarhartICRdata=function() { 
    	  $scope.graphArray=[];
    	         var originalAllocValues = [];
    	 var currentAllocValues = [];
    	 angular.forEach($scope.custICRReport, function(obj) {
    	 //obj.profitNloss=obj.TCMP-obj.TCP;
    	 //obj.originalAllocPercentage=obj.TCP/$scope.getRebalTcpTotal();
    	 //obj.currentAllocPercentage=obj.TCMP/$scope.getRebalTcmpTotal();
    	 //obj.rebalancedAlloc = Math.round($scope.getRebalTcmpTotal()*obj.originalAllocPercentage);
    	 originalAllocValues.push([obj['_id'].IndustrySegment,obj.TCP]);
    	 currentAllocValues.push([obj['_id'].IndustrySegment,obj.TCMP]);
    	 });  
    	   
    	 $scope.graphArray.push({"key": "Original Allocation","values":originalAllocValues});
    	  
    	 $scope.graphArray.push({"key": "Current Allocation","values":currentAllocValues});
    	 }
    	  

		 $scope.xMultiBarFunction = function() {
			return function(d) {
				return d[0];
			}
		}
		$scope.yMultiBarFunction = function() {
			return function(d) {
				return d[1];
			}
		}
		var colorArray = [ '#FF0000', '#0000FF', '#FFFF00', '#00FFFF' ];
		$scope.colorFunction = function() {
			return function(d, i) {
				return colorArray[i];
			};
		}
    	  

   } 
})();