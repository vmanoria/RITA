var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use(require('./customerinput'));
app.use(require('./customeroutput'));


app.post('/contactlist', function (req, res) {
    console.log(req.body);
    db.contactlist.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

app.delete('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.contactlist.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

app.get('/contactlist/:id',function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.contactlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.contactlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                name: req.body.name,
                email: req.body.email,
                number: req.body.number
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);
    });
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('Server running at port :', port);