module.exports = function (app, db,watson,Regex){

    // app.get("/rest/customerProfile", getCustomerProfile);
    app.get("/rest/customerPortfolio", getCustomerPortfolio);
    app.get("/rest/customerPnLReport/:custid", getCustomerPnLReport);
    app.get("/rest/customerICRReport/:custid", getCustomerICRReport);
    app.get("/rest/customerRebalICRReport/:custid", getCustomerRebalICRReport);
    app.get("/rest/customerIARReport/:listOfSecurities",getIARList);
    app.get("/rest/customerEARReport/:listOfSecurities",getEARList);
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
    	var mycollection = db.collection('CustomerStockData');
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
    
    //function getIARList(listOfSecurities){
     function getIARList(req,res){
    	   var listOfSecurities  = [] ;
     	   listOfSecurities   =req.params['listOfSecurities'].split(',');
    	   //var listOfSecurities = ['ITC','SUN PHARMA','EMAMI'];
    	    var securityMap      = {'EMAMI':'EMAMI*'};
    	    var recommendMap     = ['Sell','Neutral','Buy'];
    	    var  input ;
    	    var  output ;
        //if  service calling from local env
        var retrieve_and_rank = watson.retrieve_and_rank({
        	  username: 'a9b8a528-ebe9-4310-8999-7084fae078b4',
        	  password: 'kiLJEubygpiZ',
        	  version: 'v1'
        	});

        //Overwrite, if calling from Bluemix deployment
        if (process.env.VCAP_SERVICES) {
            var services = JSON.parse(process.env.VCAP_SERVICES);
            for (var service_name in services) {
                if (service_name.indexOf('retrieve_and_rank') === 0) {
                    var service = services[service_name][0];
                    retrieve_and_rank = watson.retrieve_and_rank({
                        version: 'v1',
                        username: service.credentials.username,
                        password: service.credentials.password
                    });
                }
            }
        }
        
        var params = {
        		  cluster_id:'sce565ce57_698e_44c9_8761_edaf495546aa',
        		  collection_name: 'rita_collection',
        		  wt: 'json'
     	}; 
        
        solrClient = retrieve_and_rank.createSolrClient(params);
        console.log('Searching all documents.');
        var counter=1;
        var outputArray=[] ;
        listOfSecurities.forEach(function(item){
            console.log (item);
            var  security ;
            var  recommend ; 
            if(securityMap[item]!==undefined){
              security =securityMap[item];
            } else { 
              security =item;
            }
         
            recommendMap.forEach(function(key){
            input =security+' '+key ;
            
            searchDocument(res,solrClient,input,listOfSecurities,counter,outputArray,item);
            counter++ ;
              }); 
            
        });
     
}
   
     function searchDocument(res,solrClient,input,listOfSecurities,counter,outputArray,security){
    	     var  finalInput ; 
    	     console.log("Input for Solar Search"+input);
    	    //var  inputvar  = 'EMAMI* Buy'; 
    	    var  inputvar  	 = input ; 
    	    console.log('Searching all documents.');  
    	    var query = solrClient.createQuery();
    	    query.q({'content' : '\"'+inputvar+'\"' }); 
    	    solrClient.search(query, function(err, searchResponse){
    	      if(err) {
    	          console.log('Error searching for documents: ' + err);
    	      }
    	        else {
    	          console.log('Found ' + searchResponse.response.numFound + ' documents.');
    	          var obj ={} ;
    	          var splittedString;
    	                 if(searchResponse.response.numFound>0){
    	                     finalInput =(searchResponse.response.docs[0].content+'').replace(/\*/g ,'');
    	                     var reObj = '('+inputvar+')'+'(\\s+)(\\d+)' ;
    	                     console.log('REgEx Object for  IAR Report'+reObj);
    	                     var  re  =   new RegExp(reObj,"i");  
    	                     if ((m = re.exec(finalInput)) !== null){
    	                         console.log(m[0]);
    	                         console.log(m[1]);
    	                         console.log(m[2]);
    	                         console.log(m[3]);
    	                         console.log(m.length);
    	                         if (m.index === re.lastIndex) {
    	                             re.lastIndex++ ;
    	                         }
    	                        splittedString =m[0].split(' ');
    	                        obj.securityName  =security ; //splittedString[0];
    	                        obj.recommend 	  =splittedString[1];
    	                        obj.targetprice   =splittedString[2];
    	                        outputArray.push(obj);
    	                        
    	                      }
    	                     
    	               } else {
    	            	   		console.log("No Document Found");	
    	               }
    	               console.log(outputArray);
    	               console.log("Counter:"+counter);
    	               console.log("Securities Length:"+(listOfSecurities.length)*3);
    	               //if(counter==(listOfSecurities.length && outputArray.length==2){
    	               if(counter==((listOfSecurities.length)*3)){
    	            	  res.json(outputArray);
    	               }
    	         	                   	             	          
    	          } 
    	    });  
    	    
       	}
     
     function getCustomerRebalICRReport(req, res) {
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
                                         profitNloss : { $sum: 0 },
                                         originalAllocPercentage : { $sum: 0 },
                                         currentAllocPercentage : { $sum: 0 },
                                         rebalancedAlloc:{ $sum: 0 },
                                         incrementalInvest:{ $sum: 0 },
                                         count: { $sum: 1 }                              
 }
                         }
                     ],
                        function (err,docs){
      console.log(docs);
      res.json(docs);
  });
}
     
   //function getIARList(listOfSecurities){
     function getEARList(req,res){
    	 //needs to be removed after  integration.
    	//var listOfSecurities = ['ITC','SUN PHARMA','EMAMI','YES BANK','XYZ'];
    	var listOfSecurities  = [] ;
    	listOfSecurities   =req.params['listOfSecurities'].split(',');
    	console.log("List of  Securities ::"+listOfSecurities);
    	var retrieve_and_rank = watson.retrieve_and_rank({
        	  username: 'a9b8a528-ebe9-4310-8999-7084fae078b4',
        	  password: 'kiLJEubygpiZ',
        	  version: 'v1'
         });

        //Overwrite, if calling from Bluemix deployment
        if (process.env.VCAP_SERVICES) {
            var services = JSON.parse(process.env.VCAP_SERVICES);
            for (var service_name in services) {
                if (service_name.indexOf('retrieve_and_rank') === 0) {
                    var service = services[service_name][0];
                    retrieve_and_rank = watson.retrieve_and_rank({
                        version: 'v1',
                        username: service.credentials.username,
                        password: service.credentials.password
                    });
                }
            }
        }
        
        var params = {
        		  cluster_id:'sce565ce57_698e_44c9_8761_edaf495546aa',
        		  collection_name: 'rita_external_collection',
        		  wt: 'json'
     	}; 
        
        solrClient = retrieve_and_rank.createSolrClient(params);
        console.log('Searching all documents.');
        var query = solrClient.createQuery();
        query.q({'*':'*'});
        var outputArray=[];
        var  counter=1;
        listOfSecurities.forEach(function(item){
        	
        	console.log (item);
            solrClient.search(query, function(err, searchResponse){
          	  if(err) {
          	    console.log('Error searching for documents: ' + err);
          	  }
          	    else {
          	    console.log('Found ' + searchResponse.response.numFound + ' documents.');
          	  
          	  var input ='('+item+')';
          	  //var input ='(ITC Limited)'; 
          	  var recommend ='(Buy|Sell|Hold)'
          	  var reObj = input+'(\\s+)(\\d+)(\\s)(\\d+)(\\s)'+recommend; 
          	  console.log("Re ex varaible"+reObj);
          	  var  re  =   new RegExp(reObj,"i");  
          	  var m ;
          	  if(searchResponse.response.numFound>0){
	          	  if ((m = re.exec(searchResponse.response.docs[0].content)) !== null){
	          	   /* console.log(m[0]);
	          	    console.log(m[1]);
	          	    console.log(m[2]);
	          	    console.log(m[3]);
	          	    console.log(m[4]);
	          	    console.log(m[5]);
	          	    console.log(m[6]);
	          	    console.log(m[7]);*/
	          	    console.log(m.length);
		          	    if (m.index === re.lastIndex) {
		          	        re.lastIndex++ ;
		          	    }
		          	    var  obj={}; 
		          	    obj.securityName=item ;
		          	    obj.targetprice=m[5];
		          	    obj.recommend=m[7];
		          	   	outputArray.push(obj);
		          	    console.log("Counter Value: "+counter);
		          	    console.log("Securities Length: "+listOfSecurities.length );
		          	    if(counter==listOfSecurities.length){
		          	    	res.json(outputArray);
		          	    }
	          	          	    
	          	   }  //end of inner if
          	  counter++ ;
          	 }//end of  outer if  
           }	  
          
      });
            
    });
        
        
        
}

}