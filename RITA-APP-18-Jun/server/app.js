module.exports = function (app, db, fs, watson,Regex,request) {
    require("./services/page.service.server.js")(app, db,watson,Regex);
    require("./services/server.customer.service.js")(app, db);
    require("./services/pi.server.service.js")(app, db, fs, watson);
 // For PI MVP2
    require("./i18n")(app);
    // For AN MVP2s
    require("./services/an.server.service.js")(app, db, fs, watson, request);
};