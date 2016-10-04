var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var request = require('request');

// For accesing Data from mongoDB
var connectString = "169.44.118.232/RITA-DB"

// Overwrite if not on Blumix
if (process.env.NOT_ON_BLUEMIX)
    connectString = "localhost/RITA-DB";

var db = mongojs(connectString);
console.log('Connecting mongoDB @ ', connectString);

//Upload specific Code

require('dotenv').config({silent: true});

var da = require('./routes/da.js'),
  multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
	console.log("file path in local:"+file);
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })


// for personality insights
var watson = require('watson-developer-cloud');
var fs = require('fs');
var regex = require("regex");  
//  --------------------


require("./server/app.js")(app, db, fs, watson,regex,request);

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());


var port = process.env.VCAP_APP_PORT || 3000;

app.listen(port, function () {
    console.log("Server running on port: ", port);
});

//Upload  service
app.post('/entities', upload.single('file'), da.entities);

app.post('/clear', function (req, res) {
	console.log("Clear records in stockInfo");
		var mycollection =db.collection('stockInfo');
		mycollection.remove( { } ); 
		console.log("Records Cleared");
});