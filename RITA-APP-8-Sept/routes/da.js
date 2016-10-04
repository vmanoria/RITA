'use strict';
var watson  = require('watson-developer-cloud');
var fs 		= require('fs');
var mongojs = require('mongojs');
var  _  	= require('underscore');
//var connectString = "localhost/RITA-DB"
var connectString =process.env.DB_INSTANCE;
var db = mongojs(connectString);
console.log('Connecting mongoDB @ ', connectString);

var document_conversion = watson.document_conversion({
  username:     process.env.DC_USER_NAME || '<document_conversion_user_name>',
  password:     process.env.DC_PASSWORD || '<document_conversion_password>',
  version:      'v1',
  version_date: '2016-06-30'
});

// if bluemix credentials exists, then override local
var alchemyLanguage = watson.alchemy_language({
  api_key: process.env.API_KEY || '<api_key>'
});

function convert_document(req){

}
module.exports.entities = function(req, res, next) {
   console.log(req.file);

  if (!req.file  && !req.file.path){
    return next({ error: 'Missing required parameter: file', code: 400 });
  }
  // convert a single document
  document_conversion.convert({
    // (JSON) ANSWER_UNITS, NORMALIZED_HTML, or NORMALIZED_TEXT
    file: fs.createReadStream(req.file.path),
    conversion_target: document_conversion.conversion_target.NORMALIZED_TEXT
	}, function (err, response) {
    if (err){
      console.error(err);
      res.send(err);
    } else {
      console.log("Document converted successfully.");
	 // fs.writeFile('\\emami.txt',response);
	  getEntities(response,res);
    }
  });
};

function getEntities(input,res) {
    alchemyLanguage.entities({
        text:input,
        model:process.env.MODEL_ID || "<model_id>"}, function(err, response){
		console.log("Error Console");
      if (err) {
	    console.log("Error Console"+err);
        return next(err);
      }
		console.log("Entities"+response);
		var stockinfo= saveResponse(response); 
		//var collection =db.collection('stockInfo');
		//collection.insert(stockinfo);
		var mycollection =db.collection('stockInfo');
		mycollection.update({STOCK:stockinfo.STOCK},stockinfo,{upsert:true});               
		
	    return res.json(response);
    });
	
 }

function getSections(response){
  var sections = [];
  for (var i in response.answer_units) {
    var answer = response.answer_units[i];
    var title = answer.title;
    var section = {};
    var text = "";
    for (var j in answer.content) {
      if (answer.content[j].media_type == "text/plain") {
        text = answer.content[j].text;
      }
    }
    section["title"] = title;
    section["text"] = text;
    if (section.text.trim().length > 0){
      sections.push(section);
    }
  }
  return sections;
} 

function  saveResponse(result){ 
var  resultArray =[];
var  object ={} 
//var inputArray   = JSON.parse(result);
var entityArray  = result.entities ;
console.log("Entity Array"+entityArray);  
var sector = _.filter(entityArray,function(entity) {
         return entity.type==='SECTOR';
       });
object.SECTOR =sector[0].text;	   
console.log(sector[0].text);
var stock = _.filter(entityArray,function(entity) {
         return entity.type==='STOCK';
       });
object.STOCK =stock[0].text;	   
console.log(stock[0].text);

var cmp_tp = _.filter(entityArray,function(entity) {
         return entity.type==='CURRENCYNUMBER';
       });
object.CMP =cmp_tp[0].text;
object.TP  =cmp_tp[1].text;	   	   
console.log(cmp_tp[0].text);
console.log(cmp_tp[1].text);	
var recommend = _.filter(entityArray,function(entity){
         return entity.type==='RECOMMEND';
       });
object.RECOMMEND =recommend[0].text;	   
console.log(recommend[0].text);		   
return object;
} 
