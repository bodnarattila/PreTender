const config = require('./config');

const express = require('express'),
    got = require('got'),
    cors = require('cors'),
    mongoClient = require('mongodb'),
    oid = require('mongodb').ObjectId,
    app = express();

app.use(express.json());
app.use(cors());

/*app.get('/tendertype', function (req, res) {
    var query = { type: req.headers.type };
    var dbToClose;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dbToClose = db;
            return db.collection('tenderTypes');
        })
        .then(coll => {
            return coll.findOne(query);
        })
        .then(result => {
            dbToClose.close();
            res.status(200).json(result);
        })
        .catch(err => {
            dbToClose.close();
            res.status(400).json(err.message);
        });
});*/

app.get('/tendertype', function (req, res) {
    var dataBase, tmp;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dataBase = db;
            return db.collection('tenderTypes');
        })
        .then(coll => {
            return coll.find({}).toArray();
        })
        .then(result => {
            dataBase.close();
            res.status(200)
                .json(result);
        })
        .catch(err => {
            dataBase.close();
            res.status(404)
                .json(err.message);
        });
});


app.get('/tendertype/:id', function (req, res) {
    var query = { _id: req.params.id };
    var dbToClose;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dbToClose = db;
            return db.collection('tenderTypes');
        })
        .then(coll => {
            return coll.findOne(query);
        })
        .then(result => {
            dbToClose.close();
            res.status(200).json(result);
        })
        .catch(err => {
            dbToClose.close();
            res.status(400).json(err.message);
        });
});

app.listen(config.get('port'));
