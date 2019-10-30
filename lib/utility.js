

class util
{
    static get rootURL() { return "https://smelaku:cse6242@opensky-network.org/api" };
    static get dbURL() { return "http://localhost:8000"}

    constructor()
    {

    }

    getUnixTime(year, month, date, hour, minutes, seconds)
    {
        var date = new Date(year, month, date, hour, minutes, seconds);
        return date.getTime();
    }

    getUnixTimeFromDate(date)
    {
        return Math.round(date.getTime()/1000.00);   // convert from ms to s
    }

    getDateFromUnixTime(unixTime)
    {
        var date = new Date();
        date.setTime(unixTime * 1000);

        return date;
    }

    getCurrentState(callbackFunc)
    {
        var request = new XMLHttpRequest();
        var thisURL = util.rootURL + "/states/all";
        request.open('GET', thisURL);
        request.onload = function()
        {
            var data = JSON.parse(this.response);

            if(request.status == 200)
            {
                callbackFunc(data);
            }
            else
            {
                console.log("***ERROR: unexpected response: ", request.response);
            }
        };
        request.send();
    }
    
    getFlightsByTime(beginTime, endTime, callbackFunc)
    {
        var request = new XMLHttpRequest();
        var thisURL = util.rootURL + "/flights/all";
        var beginTimeUnix = this.getUnixTimeFromDate(beginTime);
        var endTimeUnix = this.getUnixTimeFromDate(endTime);
        thisURL = thisURL + "?begin=" + beginTimeUnix + "&end=" + endTimeUnix;

        request.open('GET', thisURL);
        console.log(thisURL);
        
        request.onload = function()
        {
            var data = JSON.parse(this.response);

            if(request.status == 200)
            {
                callbackFunc(data)
            }
            else
            {
                console.log("***ERROR: unexpected response: ", request.response);
            }
        }

        request.send();
    }


    getFlightsByArrivalAirport(airportCode, beginTime, endTime, callbackFunc)
    {
        var request = new XMLHttpRequest();
        var thisURL = util.rootURL + "/flights/arrival";
        var beginTimeUnix = this.getUnixTimeFromDate(beginTime);
        var endTimeUnix = this.getUnixTimeFromDate(endTime);
        thisURL = thisURL + "?airport=" + airportCode + "&begin=" + beginTimeUnix + "&end=" + endTimeUnix;

        request.open('GET', thisURL);
        console.log(thisURL);
        
        request.onload = function()
        {
            var data = JSON.parse(this.response);

            if(request.status == 200)
            {
                callbackFunc(data)
            }
            else
            {
                console.log("***ERROR: unexpected response: ", request.response);
            }
        }

        request.send();
    }

    getFlightsByDepartureAirport(airportCode, beginTime, endTime, callbackFunc)
    {
        var request = new XMLHttpRequest();
        var thisURL = util.rootURL + "/flights/departure";
        var beginTimeUnix = this.getUnixTimeFromDate(beginTime);
        var endTimeUnix = this.getUnixTimeFromDate(endTime);
        thisURL = thisURL + "?airport=" + airportCode + "&begin=" + beginTimeUnix + "&end=" + endTimeUnix;

        request.open('GET', thisURL);
        console.log(thisURL);
        
        request.onload = function()
        {
            var data = JSON.parse(this.response);

            if(request.status == 200)
            {
                callbackFunc(data)
            }
            else
            {
                console.log("***ERROR: unexpected response: ", request.response);
            }
        }

        request.send();
    }


    getTrackByAircraft(icao24, interestTime, callbackFunc)
    {
        var request = new XMLHttpRequest();
        var thisURL = util.rootURL + "/tracks";
        thisURL = thisURL + "?icao24=" + icao24 + "&time=" + interestTime;

        request.open('GET', thisURL);
        console.log(thisURL);
        
        request.onload = function()
        {
            var data = JSON.parse(this.response);

            if(request.status == 200)
            {
                callbackFunc(data)
            }
            else
            {
                console.log("***ERROR: unexpected response: ", request.response);
            }
        }

        request.send();
    }  

    drawMarker(lat, long)
    {
        
    }

    sendSQLQuery(sqlQuery, callbackFunc)
    {
        var request = new XMLHttpRequest();
        var thisURL = util.dbURL + "/sqlquery";

        request.open('POST', thisURL);
        request.setRequestHeader("Content-type", "text/plain");
        //request.setRequestHeader("Access-Control-Allow-Origin", "*");
        
        console.log(thisURL);

        request.onreadystatechange = function()
        {
            if(this.readyState == XMLHttpRequest.DONE && this.status == 200)
            {
                var data = JSON.parse(this.response);
                callbackFunc(data)
            }

        }

        request.send(sqlQuery);
    }
}