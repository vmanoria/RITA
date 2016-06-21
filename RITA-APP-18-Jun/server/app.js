module.exports = function (app, db, fs, watson) {
    require("./services/page.service.server.js")(app, db);
    require("./services/server.customer.service.js")(app, db);
    require("./services/pi.server.service.js")(app, db, fs, watson);
};