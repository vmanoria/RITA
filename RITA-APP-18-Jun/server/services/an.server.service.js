module.exports = function (app, db, fs, watson, request) {


    app.get("/rest/alchemynewsurls", getAlchemyNewsURLs);

    function getAlchemyNewsURLs(req, res) {
        var securities = 'ITC^YES%20BANK^SBI^SUN%20FARMA^EMAMI';
        //var securities = 'YES%20BANK^SUN%20FARMA^EMAMI';

        request.get('https://gateway-a.watsonplatform.net/calls/data/GetNews?outputMode=json&start=now-15d&end=now&count=20&q.enriched.url.enrichedTitle.keywords.keyword.text=' + securities + '&return=enriched.url.url,enriched.url.title&apikey=6986aa6422f93320f04afb2fc73b185d1f64f16c', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
                //console.log(res); //Print the google web page.
            }
        });
        /*
        request.get('https://access.alchemyapi.com/calls/data/GetNews?apikey=6986aa6422f93320f04afb2fc73b185d1f64f16c&return=enriched.url.title,enriched.url.url&start=now-7d&end=now&q.enriched.url.entities.entity=|text=[SBI^ITC],type=organization|&q.enriched.url.taxonomy.taxonomy_.label=finance&count=10&outputMode=json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
                //console.log(res); //Print the google web page.
            }
        });
        */
        /*
                 *********** Using Node SDK
    https://access.alchemyapi.com/calls/data/GetNews?apikey=6986aa6422f93320f04afb2fc73b185d1f64f16c&return=enriched.url.title,enriched.url.url&start=1464741000&end=1467673200&q.enriched.url.entities.entity=|text=ITC%5ESBI,type=organization|&q.enriched.url.taxonomy.taxonomy_.label=finance&count=25&outputMode=json

                // Create alchemy_data_news object using our api_key
                var alchemy_data_news = watson.alchemy_data_news({
                    //api_key: '6986aa6422f93320f04afb2fc73b185d1f64f16c'
                    api_key: '124d154f241fd356c14fa313e102a2616c7c5246'
                });

                // Define params for the query and what values to return
                // Accepted returne values:s
                // docs.alchemyapi.com/v1.0/docs/full-list-of-supported-news-api-fields
                var security = req.params['security'];
                console.log('security: ', security);
                //for (var i = 0; i < securities.length; i++) {
                var params = {
                    start: 'now-15d',
                    end: 'now',
                    count: 10,
                    // 'q.enriched.url.enrichedTitle.keywords.keyword': '|text=ITC^SBI|', // NOT WORKING Multtiple text Values
                    'q.enriched.url.enrichedTitle.keywords.keyword': '|text=' + security + '|', // This Works
                    return: ['enriched.url.title,enriched.url.url']
                };
                //console.log('**** securities[i] ', securities[i]);
                // Call getNews method and return json
                alchemy_data_news.getNews(params, function (err, news) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        //console.log(JSON.stringify(news, null, 2));
                        res.json(JSON.stringify(news, null, 2));
                        //wait(7000);
                    }
                });
                */
    }
}