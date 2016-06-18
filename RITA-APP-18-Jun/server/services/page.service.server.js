module.exports = function (app, db) {

    // app.get("/rest/customerProfile", getCustomerProfile);
    app.get("/rest/customerPortfolio", getCustomerPortfolio);
    app.get("/rest/customerPnLReport", getCustomerPnLReport);
    //    app.get("/rest/securityIndustrySegments", getSecurityIndustrySegments);
    //  app.get("/rest/customerTransactionData", getCustomerTransactionData);

    

    function getCustomerPortfolio(req, res) {

        var mycollection = db.collection('customer')
        mycollection.find(function (err, docs) {
            //console.log(docs);
            res.json(docs);

        });
    }

    function getCustomerPnLReport(req, res) {
        var mycollection = db.collection('customer')
            mycollection.aggregate([
             {$match: { "CustomerID" : 100 }},  
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

}