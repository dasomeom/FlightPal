var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('flightpal.db');

var express = require('express');
var restapi = express();

restapi.get('/test', function(req, res){
    res.json({message: 'Hello! from flightpal rest api'})
});

restapi.get('/flights_time', function(req, res){
    var firstSeen = req.query.firstseen;
    var lastSeen = req.query.lastseen;

    if (firstSeen != undefined && lastSeen != undefined)
    {
        var queryString = "SELECT * FROM opensky WHERE firstseen >= " + firstSeen + " AND lastseen <= " + lastSeen;

        db.all(queryString, function(err, row){
            if (err)
            {
                res.sendStatus(500);
                console.log("Query returned error ", err);
            }
            else
            {
                console.log(row);
                res.json(row);
            }
        });
        console.log(queryString, firstSeen, lastSeen);
    }
    else
    {
        res.status(404);
        res.end();
    }
});
restapi.listen(8000);
