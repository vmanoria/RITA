(function () {
    angular
        .module("RitaApp")
        .controller("CustomerPnLController", customerPnLController);

    function customerPnLController($scope, DisplayPnLService) {
        $scope.displayPnLReport = displayPnLReport ;
        $scope.getCustomers = getCustomers;
        
        

        /*  function displayPnLReport() {
            console.log("getCustomers");

          DisplayPnLService.getPnLReport(function (response) {
                $scope.custPnLReport = response ;
            });

         $scope.getCustomers = function() {
        	    DisplayPnLService.getCustomers(function (response) { 
                console.log("getCustomers");
                $scope.customers = response;
                $scope.selectedCustomer = "Select Customer";
            });
         }   
            
        }*/

        function getCustomers() {
              DisplayPnLService.getCustomers(function (response) { 
                console.log("getCustomers");
                $scope.customers = response;
                $scope.selectedCustomer = "Select Customer";
            });

         }

        function prepareGraphParameters(customerID) { 
                console.log("Inside prepareGraphParameter");             
                angular.forEach($scope.custPnLReport,function(el) {
                  console.log("FRD"+el._id['FRD_TCP']);  
                  console.log("FRD"+el._id['FRUD_TCP']);  
                   }
              );
          } 

        getCustomers() ;
        
     
        function displayPnLReport(customerID) {
             console.log("Inside displayPnLReport");
             DisplayPnLService.getPnLReport(customerID,function (response) {
                $scope.custPnLReport = response ;
                $scope.prepareGraphParameter();

            });
          

        }  
        
        

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

    $scope.prepareGraphParameter=function() { 
          console.log("Inside prepareGraphParameter"); 
          var    graphArray   =[]; 
          $scope.graphArray1   =[];   
          var i=0;

          if(angular.isDefined($scope.custPnLReport)){  
            angular.forEach($scope.custPnLReport,function(el) {
                var  object ={};
                var total= $scope.getTotal('FRD_TCP');  
                var allocationpercentage = (el._id['FRD_TCP']/total)*100;
               // graphArray1=({key:el._id['SecurityName'],y:allocationpercentage }); 
               object.key  =el._id['SecurityName'];
               object.y  =Math.round((el._id['FRD_TCP']/total)*100);
               $scope.graphArray1.push(object);
               
               i++;
              //  graphArray = [
              //    { key: "One", y: 5 }];
            
          });
        } 

        /*for (var key in graphArray1) {
            if (graphArray1.hasOwnProperty(key)) {
                var val = graphArray1[key];
              graphArray = [
                { key: "One", y: 5 },{ key: "Two", y: 5 }];
              console.log(val);
            }
         } */  
         //graphArray1=[{"key":"SUN PHARMA","y":27},{"key":"SBI","y":3},{"key":"EMAMI","y":26},{"key":"ITC","y":15},{"key":"YES BANK","y":29}];
         // console.log("--------------------------------------------------------"+JSON.stringify(graphArray1));
         //graphArray = [
          //       { key: "One", y: 5 },{ key: "Two", y: 5 }];
          //console.log(graphArray); 
          //console.log(graphArray1); 
          
          return $scope.graphArray1;
          
    }

    $scope.prepareCurrentGraphParameter=function() { 
          console.log("Inside prepareCurrentGraphParameter"); 
          var    graphCurrentArray =[]; 
          if(angular.isDefined($scope.custPnLReport)){  
          angular.forEach($scope.custPnLReport,function(el) {
                var  object ={};
                var total= $scope.getTotal('FRUD_TCP');  
                var allocationpercentage = (el._id['FRUD_TCP']/total)*100;
                graphArray.push({"key":el._id['SecurityName'],"y":allocationpercentage }); 
            
          });
         } 
          console.log(graphCurrentArray); 
          return graphCurrentArray ;
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

     function getCustomerInfo(customerId) {
            $scope.selectedCustomer = customerId;
            // console.log(customerName);
            DisplayPnLService.getCustomerInfo(customerName, function (response) {
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

       $scope.exampleData = [
          { key: "One", y: 5 },
          { key: "Two", y: 2 },
          { key: "Three", y: 9 },
          { key: "Four", y: 7 },
          { key: "Five", y: 4 },
          { key: "Six", y: 3 },
         { key: "Seven", y: 9 }
     ];

    $scope.yFunction = function(){
    return function(d){
    return d.y;
    };
   }

    $scope.xFunction = function(){
    return function(d) {
        return d.key;
    };
 }
}



    


})();