module.exports = function (app, db){

    // app.get("/rest/customerProfile", getCustomerProfile);
    app.get("/rest/customerPortfolio", getCustomerPortfolio);
    app.get("/rest/customerPnLReport/:custid", getCustomerPnLReport);
    app.get("/rest/customerICRReport/:custid", getCustomerICRReport);
    //   app.get("/rest/securityIndustrySegments", getSecurityIndustrySegments);
    //  app.get("/rest/customerTransactionData", getCustomerTransactionData);

    

    function getCustomerPortfolio(req, res) {

        var mycollection = db.collection('CustomerStockData')
        mycollection.find(function (err, docs) {
            //console.log(docs);
            res.json(docs);

        });
    }

    function getCustomerPnLReport(req, res) {
    	var mycollection = db.collection('CustomerStockData')
        var custID = parseInt(req.params['custid']); 
        console.log("CustomerID ::"+custID);
            mycollection.aggregate([
             {$match: { "CustomerID" :custID}},  
             {$unwind:"$stocks"},
                {$group:
                {_id:{
                      CustID:"$CustomerID",
                      AccNum:"$AccountNumber",
                      SecurityID:"$stocks.SecurityID",
                      SecurityName:"$stocks.SecurityName",
                      AssetType:"$stocks.AssetType",
                     
                      FRD:{ $arrayElemAt:["$stocks.Portfolio.First_Report_Date",0]},
                      FRD_Avg_CostPrice:{ $arrayElemAt:["$stocks.Portfolio.AverageCostPrice_FRD_INR",0]},
                      FRD_Quantity:{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FRD",0]},
                      FRD_TCP : {$multiply:[{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FRD",0]},{ $arrayElemAt:["$stocks.Portfolio.AverageCostPrice_FRD_INR",0]}]},

                      FURD:{ $arrayElemAt:["$stocks.Portfolio.FollowUp_Report_Date",0]},
                      FURD_Avg_CostPrice:{ $arrayElemAt:["$stocks.Portfolio.CurrentMarketPrice_FURD_INR",0]},
                      FURD_Quantity:{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FURD",0]},
                      FURD_TCP : {$multiply:[{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FURD",0]},{ $arrayElemAt:["$stocks.Portfolio.CurrentMarketPrice_FURD_INR",0]}]},
                      PROFIT_LOSS:{$subtract:[
                        {$multiply:[{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FURD",0]},{ $arrayElemAt:["$stocks.Portfolio.CurrentMarketPrice_FURD_INR",0]}]}
                        ,
                        {$multiply:[{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FRD",0]},{ $arrayElemAt:["$stocks.Portfolio.AverageCostPrice_FRD_INR",0]}]}
                      ]}
                  }}
               }
           ],
            function (err,docs){
            console.log(docs);
            res.json(docs);
        });
    }
    
    function getCustomerICRReport(req, res) {
    	var mycollection = db.collection('CustomerStockData')
    	var custID = parseInt(req.params['custid']);
    	console.log("CustomerID:"+custID);
        mycollection.aggregate([
                                {$match: { "CustomerID" : custID}}, 
                          	   {$unwind:"$stocks"},
                     		   {$group:
                                	{_id:{
                                	      custID:"$CustomerID",
                                	      IndustrySegment:"$stocks.IndustrySegment"
                                	      },
                     	         TCP  : {$sum:{$multiply:[{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FRD",0]},{ $arrayElemAt:["$stocks.Portfolio.AverageCostPrice_FRD_INR",0]}]}},
                     	         TCMP : {$sum:{$multiply:[{ $arrayElemAt:["$stocks.Portfolio.Quantity_For_FURD",0]},{ $arrayElemAt:["$stocks.Portfolio.CurrentMarketPrice_FURD_INR",0]}]}},
                              	 count: { $sum: 1 }           	   
                                	}
                                }
                            ],
     		function (err,docs){
             console.log(docs);
             res.json(docs);
         });
    } 


}