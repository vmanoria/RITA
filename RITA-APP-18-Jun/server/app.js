module.exports = function (app, mongojs, db){
    require("./services/page.service.server.js")(app, mongojs, db); 
 };