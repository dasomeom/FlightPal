var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('flightpal.db');

var express = require('express');
var restapi = express();
var bodyParser = require('body-parser');
//restapi.use(bodyParser.json());
restapi.use(bodyParser.text());
//restapi.use(express.bodyParser());

restapi.get('/test', function(req, res){
    res.json({message: 'Hello! from flightpal rest api'})
});

// restapi.get('/flights_time', function(req, res){
//     var firstSeen = req.query.firstseen;
//     var lastSeen = req.query.lastseen;

//     if (firstSeen != undefined && lastSeen != undefined)
//     {
//         var queryString = "SELECT COUNT(*) FROM opensky WHERE firstseen >= " + firstSeen + " AND lastseen <= " + lastSeen;

//         db.all(queryString, function(err, row){
//             if (err)
//             {
//                 res.sendStatus(500);
//                 console.log("Query returned error ", err);
//             }
//             else
//             {
//                 console.log(row);
//                 res.json(row);
//             }
//         });
//         console.log(queryString, firstSeen, lastSeen);
//     }
//     else
//     {
//         res.status(404);
//         res.end();
//     }
// });

restapi.post('/sqlquery', function(req, res){
    queryString = req.body;
    console.log("/sqlquery\n" , queryString);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");

    if(queryString != undefined)
    {
        db.all(queryString, function(err, row)
        {
            if (err)
            {
                res.sendStatus(500);
                console.log("query returned error ", err)
            }
            else
            {
                console.log(row);
                res.json(row);
            }
        });
    }
    else
    {
        res.sendStatus(404);
    }
});

console.log("Listning on port 8000\n")
restapi.listen(8000);
