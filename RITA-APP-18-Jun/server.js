var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

// For accesing Data from mongoDB
var connectString = "169.44.118.232/RITA-DB"

// Overwrite if not on Blumix
if (process.env.NOT_ON_BLUEMIX)
    connectString = "localhost/RITA-DB";

var db = mongojs(connectString);
console.log('Connecting mongoDB @ ', connectString);

// for personality insights
var watson = require('watson-developer-cloud');
var fs = require('fs');
//  --------------------



require("./server/app.js")(app, db, fs, watson);

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());


var port = process.env.VCAP_APP_PORT || 3000;

app.listen(port, function () {
    console.log("Server running on port: ", port);
});