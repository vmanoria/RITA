module.exports = function (app, db, fs, watson) {


    app.get("/rest/customerlist", getCustomerList);
    app.get("/rest/customerTwit/:custName", getCustomerTwit);
    app.post("/rest/analyzetwit/:custName", analyzeTwit);

    function getCustomerList(req, res) {
        var mycollection = db.collection('CustomerStockData')
        mycollection.find({}, {
                "CustomerName": 1
            },
            function (err, docs) {
                res.json(docs);
            });
    }

    function getCustomerTwit(req, res) {
        var mycollection = db.collection('CustomerTwits')
        var custName = req.params['custName'];
        var fileName = './client/data/' + custName + '_twit.txt'
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            res.json(data);
        });
        /*
         mycollection.find({
                 custName: custName
             }, {
                 "twit": 1
             },
             function (err, docs) {
                 res.json(docs);
             });
             */
    }

    function analyzeTwit(req, res) {

        /*
            Initialize the PersonalityInsight Service
        */
        //if PI service calling from local env
        var personality_insights = watson.personality_insights({
            username: "5a1bda92-9f49-4e32-9afb-3866aa5293cb",
            password: 'GC2R3pXixYTz',
            version: 'v2'
        });

        //Overwrite, if calling from Bluemix deployment
        if (process.env.VCAP_SERVICES) {
            var services = JSON.parse(process.env.VCAP_SERVICES);
            for (var service_name in services) {
                if (service_name.indexOf('personality_insights') === 0) {
                    var service = services[service_name][0];
                    personality_insights = watson.personality_insights({
                        version: 'v2',
                        username: service.credentials.username,
                        password: service.credentials.password
                    });
                }
            }
        }

        // Call PI service and save output JSON data

        var twit = "";
        var custName = req.params['custName'];
        var fileName = './client/data/' + custName + '_twit.txt'
        var profileFileName = './client/data/' + custName + '_profile.json'
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            twit = data;
            personality_insights.profile({
                    text: twit,
                },
                function (err, response) {
                    if (err)
                        console.log('error:', err);
                    else
                        console.log('Working. Please check profile.json.');
                    console.log('Saving to DB');
                    fs.readFile('./client/data/profile.json', 'utf8', function (err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        var personalityProfile = JSON.parse(data);
                        var mycollection = db.collection('PersonalityProfile')
                        mycollection.insert({
                                custName: custName,
                                personalityProfile: personalityProfile
                            }),
                            function (err, testData) {
                                if (err || !testData) console.log("Unable to add user");
                            }
                    });

                }).pipe(fs.createWriteStream('./client/data/profile.json'));


        });



    }
}