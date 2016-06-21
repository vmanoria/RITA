module.exports = function (app, db) {

    app.get("/rest/customers", getCustomerList);
    
    function getCustomerList(req, res) {
        var mycollection = db.collection('CustomerStockData')
        mycollection.find({},{
                "CustomerName": 1,"CustomerID":1
            },
            function (err, docs) {
                res.json(docs);
            });
    }

  }