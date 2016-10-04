(function () {
    angular
        .module("RitaApp")
        .controller("FileUploadController", fileUploadController);

    function fileUploadController($scope, DisplayICRService) {
        $scope.uploadFile = uploadFile ;
        $scope.getCustomers = getCustomers ;
                

        function uploadFile() {
            
        }
        
        function getCustomers(){
            DisplayICRService.getCustomers(function (response) { 
              console.log("getCustomers");
              $scope.customers = response;
              $scope.selectedCustomer = "Select Customer";
          });

       }
     getCustomers();   
     
   } 
})();