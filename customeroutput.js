var express = require('express')
var mongojs = require('mongojs');
var db = mongojs('RITA-DB');
var router = module.exports = express.Router();

router.get('/customerPnLReport', function (req, res) {
    var mycollection = db.collection('CustomerPnLReport')
    mycollection.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

router.get('/cutomerICR', function (req, res) {
    var mycollection = db.collection('customerICR')
    mycollection.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

