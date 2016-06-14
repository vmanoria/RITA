var express = require('express')
var mongojs = require('mongojs');
var db = mongojs('RITA-DB');
var router = module.exports = express.Router();


router.get('/customerDemographicProfile', function (req, res) {
    var mycollection = db.collection('CustomerDemographicProfile')
    mycollection.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

router.get('/customerPortfolioProfile', function (req, res) {
    var mycollection = db.collection('customerPortfolioProfile')
    mycollection.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

router.get('/customerTransactionData', function (req, res) {
    var mycollection = db.collection('CustomerTransactionData')
    mycollection.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

router.get('/customerRiskProfile', function (req, res) {
    var mycollection = db.collection('CustomerRiskProfile')
    mycollection.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});
