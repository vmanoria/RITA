module.exports = function (app, db, fs, watson, request) {


    app.get("/rest/alchemynewsurls/:securityNames", getAlchemyNewsURLs);

    function getAlchemyNewsURLs(req, res) {
        var securityNames = req.params['securityNames'];
        var securityList = "";


        for (i = 0; i < securityNames.length; i++) {
            securityList = securityList + securityNames[i].replace(/ /g, "%20");
        }
        securityList = securityList.replace(/,/g, '^');

        request.get('https://gateway-a.watsonplatform.net/calls/data/GetNews?outputMode=json&start=now-15d&end=now&count=20&q.enriched.url.enrichedTitle.keywords.keyword.text=' + securityList + '&return=enriched.url.url,enriched.url.title&apikey=1bcd57e79704c6aa7aa9b51fec46949940224bef', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
                //console.log(res); //Print the google web page.
            }
        });
    }
}