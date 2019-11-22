
depCityHandle = document.getElementById("depCityName");
arrCityHandle = document.getElementById("arrCityName");
depDateHandle = document.getElementById("departDate");
retDateHandle = document.getElementById("returnDate");

loader = document.getElementsByClassName("loader");
loader[0].style.display = "none";


//enable autocomplete on the departure city and arrival city entry boxes
myUtil.autocomplete(document.getElementById("depCityName"), cityNames, stateNames);
myUtil.autocomplete(document.getElementById("arrCityName"), cityNames, stateNames);
depCityHandle.value = "Atlanta, Georgia";
arrCityHandle.value = "Dallas, Texas";

//Depart and Return date defaults TODO: Remove these
depDateHandle.focus();
retDateHandle.focus();
depDateHandle.value = "2020-01-02";
depDateHandle.text = "01/02/2020"
retDateHandle.value = "2020-01-20";
retDateHandle.text = "01/20/2020";
depDateHandle.blur();
retDateHandle.blur();

var departCity;
var arrivalCity;
var departDate;
var returnDate;
var searchRad;
var margin = {top: 50, right: 50, bottom: 50, left: 80}
, width = 500 - margin.left - margin.right  
, height = 350 - margin.top - margin.bottom;

function searchCities(event)
{
    event.preventDefault();
    //Form verification
    //Departure city verification

    dp = depCityHandle.value.split(", ");
    departCity = cities.find(function(e){
        return e["city_ascii"] === dp[0] && e["admin_name"] === dp[1]; 
    });
    departCityValid = departCity != undefined
    console.log(dp, departCity, departCityValid)

    if (!departCityValid)
    {
        document.getElementById("depCityError").innerHTML = "Invalid departure city";
        document.getElementById("depCityError").style.color = "red";
    }
    else
    {
        document.getElementById("depCityError").innerHTML = ""
    }

    //Arrival city verification
    dp = arrCityHandle.value.split(", ");
    arrivalCity = cities.find(function(e){
        return e["city_ascii"] === dp[0] && e["admin_name"] === dp[1]; 
    });
    arrivalCityValid = arrivalCity != undefined
    console.log(dp, arrivalCity, arrivalCityValid)

    if (!arrivalCityValid)
    {
        document.getElementById("arrCityError").innerHTML = "Invalid arrival city";
        document.getElementById("arrCityError").style.color = "red";
    }
    else
    {
        document.getElementById("arrCityError").innerHTML = ""
    }


    //Arrival city verification

    //Depart date verification
    dp = depDateHandle.value.split("-");
    // console.log(depDateHandle.value);
    departDate =  new Date(dp[0], dp[1], dp[2]);
    departDate.setMonth(departDate.getMonth() - 1);
    d = departDate.getDate();
    m = departDate.getMonth();
    y = departDate.getFullYear();
    now = new Date();
    departDateValid =   (d > 0 && d < 32 && m >= 0 && m < 13 && departDate >= now);
    
    if (!departDateValid)
    {
        console.log(departDate, d, m, y);
        document.getElementById("departDateError").innerHTML = "Invalid depart date";
        document.getElementById("departDateError").style.color = "red";
    }
    else
    {
        document.getElementById("departDateError").innerHTML = "";
    }

    //Return date verification
    dp = retDateHandle.value.split("-");
    returnDate =  new Date(dp[0], dp[1], dp[2]);
    returnDate.setMonth(returnDate.getMonth() - 1);
    d = returnDate.getDate();
    m = returnDate.getMonth();
    y = returnDate.getFullYear();
    now = new Date();
    returnDateValid =   (d > 0 && d < 32 && m >= 0 && m < 13 && departDate >= now && departDate <= returnDate);
    
    if (!returnDateValid)
    {
        console.log(returnDate, d, m, y);
        document.getElementById("returnDateError").innerHTML = "Invalid return date";
        document.getElementById("returnDateError").style.color = "red";
    }
    else
    {
        document.getElementById("returnDateError").innerHTML = "";
    }
    

    console.log(returnDate, returnDateValid, d, m, y)


    if(departCityValid && arrivalCityValid && departDateValid && returnDateValid)
    {
        //Grey out entry boxes and search button
        depCityHandle.disabled = true;
        arrCityHandle.disabled = true;
        depDateHandle.disabled = true;
        retDateHandle.disabled = true;
        document.getElementById("searchButton").disabled = true;
        document.getElementById("searchRadius").disabled = true;
        //show loader
        loader[0].style.display = "block";

         //Load departure and arrival cities on maps
        bounds  = new google.maps.LatLngBounds();
        
        var depLatLong = new google.maps.LatLng(departCity["lat"],departCity["lng"]);
        console.log(depLatLong,departCity["lat"],departCity["lng"]);
        var depMarker = new google.maps.Marker({
            position: depLatLong,
            map: citiesMapHandler,
        });
        depMarker.setTitle(departCity["city_ascii"]);
        loc = new google.maps.LatLng(depMarker.position.lat(), depMarker.position.lng());
        bounds.extend(loc);

        var arrLatLong = new google.maps.LatLng(arrivalCity["lat"],arrivalCity["lng"]);
        console.log(arrLatLong,arrivalCity["lat"],arrivalCity["lng"]);
        var arrMarker = new google.maps.Marker({
            position: arrLatLong,
            map: citiesMapHandler,
        });
        loc = new google.maps.LatLng(arrMarker.position.lat(), arrMarker.position.lng());
        bounds.extend(loc);

        citiesMapHandler.fitBounds(bounds);       //auto-zoom
        citiesMapHandler.panToBounds(bounds);     //auto-center

        //find departure airports maximum radius
        searchRad = myUtil.milesToMeters(Number(document.getElementById("searchRadius").value));
        console.log(searchRad);
        depCircle = new google.maps.Circle({
            map: citiesMapHandler,
            center: depLatLong,
            radius: searchRad,
        });
       
        //console.log(depCircle.contains(arrLatLong));
        //in radius airports
        depira = []
        for(i = 0; i < airports.length; i++)
        {
            var airportLatLog = new google.maps.LatLng(airports[i]["latitude"], airports[i]["longitude"]);
            if (depCircle.contains(airportLatLog))
            {
                depira.push(airports[i]);
            }
        }

        console.log(depira);

        //find arrival airports within maximum radius
        searchRad = myUtil.milesToMeters(Number(document.getElementById("searchRadius").value));
        console.log(searchRad);
        arrCircle = new google.maps.Circle({
            map: citiesMapHandler,
            center: arrLatLong,
            radius: searchRad,
        });
       
        //console.log(depCircle.contains(arrLatLong));
        //in radius airports
        arrira = []
        for(i = 0; i < airports.length; i++)
        {
            var airportLatLog = new google.maps.LatLng(airports[i]["latitude"], airports[i]["longitude"]);
            if (arrCircle.contains(airportLatLog))
            {
                arrira.push(airports[i]);
            }
        }

        console.log(arrira);
        
        //TODO: Show drop down airport selections for the departure and arrival airports

        var flexDays = 2;
        var databaseYear = 2018;

        //timeout if things are taking too long
        var myVar = setInterval(timeoutFunc, (1*60*60*1000));
        function timeoutFunc()
        {
            checkCompletion(true);
        }

        //Retreive data for departure and arrival airports around the departing date in 2018
        var thisDay = new Date(departDate);
        thisDay.setFullYear(databaseYear);
        thisDay.setHours(0,0,0,0);
        depQueryDepartDatesCount = 0;
        arrQueryDepartDatesCount = 0;
        for (d = 0; d <= 2 * flexDays; d++)
        {                        
            for(i = 0; i < depira.length; i++)
            {
                thisICAO = depira[i]["icao"];
                depQuery = "SELECT COUNT(*) FROM opensky WHERE (estdepartureairport='" +  thisICAO + "' or estarrivalairport='" + thisICAO + "') " ;
                firstTimeUnix = myUtil.getUnixTimeFromDate(thisDay);
                lastTimeUnix = firstTimeUnix + (24 * 60 * 60);
                depQuery += "and (firstseen >= " + firstTimeUnix + " and lastseen <= " + lastTimeUnix + ")";
                myUtil.sendSQLQuery(depQuery, depQueryDepartDatesCallback, new Date(thisDay), depira[i]);
                console.log(depQuery);
                depQueryDepartDatesCount++;
            }
            for(i = 0; i < arrira.length; i++)
            {
                thisICAO = arrira[i]["icao"];
                depQuery = "SELECT COUNT(*) FROM opensky WHERE (estdepartureairport='" +  thisICAO + "' or estarrivalairport='" + thisICAO + "') " ;
                firstTimeUnix = myUtil.getUnixTimeFromDate(thisDay);
                lastTimeUnix = firstTimeUnix + (24 * 60 * 60);
                depQuery += "and (firstseen >= " + firstTimeUnix + " and lastseen <= " + lastTimeUnix + ")";
                myUtil.sendSQLQuery(depQuery, arrQueryDepartDatesCallback, new Date(thisDay), arrira[i]);
                console.log(depQuery);
                arrQueryDepartDatesCount++;
            }
            thisDay.setDate(thisDay.getDate() + 1)
        }

        //TODO: wrap with an exception handler
        var departAirportDepartData = [];
        function depQueryDepartDatesCallback(data, date, airport)
        {
            depQueryDepartDatesCount--;
            thisData = {
                "date":date.getMonth() + "/" + date.getDate(),
                "airport": airport["icao"],
                "airportName": airport["airportname"],
                "count": data[0]['COUNT(*)']
            }
            departAirportDepartData.push(thisData);                        
            console.log(data[0]['COUNT(*)'], date, airport["airportname"]);
            checkCompletion();
        }

        var arrivalAirportDepartData = [];
        function arrQueryDepartDatesCallback(data, date, airport)
        {
            arrQueryDepartDatesCount--;
            
            thisData = {
                "date":date.getMonth() + "/" + date.getDate(),
                "airport": airport["icao"],
                "airportName": airport["airportname"],
                "count": data[0]['COUNT(*)']
            }
            arrivalAirportDepartData.push(thisData);
            // arrivalAirportDepartData data;
            console.log(data[0]['COUNT(*)'], date, airport["airportname"])
            checkCompletion();
        }


        function checkCompletion(timeout = false)
        {
            //Check for completion and remove progress indicator and any lingering queries
            if((depQueryDepartDatesCount == 0 && arrQueryDepartDatesCount == 0) || timeout)
            {
                console.log(timeout, depQueryDepartDatesCount, arrQueryDepartDatesCount);
                loader[0].style.display = "none";
                if (!timeout)
                {
                    ps = "departAirportDepartDate";
                    console.log("search completed displaying bar chart: ", departAirportDepartData);
                    displayBarChart(departAirportDepartData, ps);
                }
            }
        }

    }

   
    console.log("City search performed")
}



function displayBarChart(airportDateData, elementId)
{
    console.log(airportDateData);

    d3.select("Cities").select(elementId).remove();
    
    var yMin = airportDateData[0]["count"];
    var yMax = yMin;
    sortedData = []
    
    for (i = 0; i < airportDateData.length; i++)
    {
        thisCount = airportDateData[i]["count"];
        yMin = Math.min(yMin, thisCount);
        yMax = Math.max(yMax, thisCount);
        sortedData.push(airportDateData[i]);
    }

    sortedData.sort(sortDict);
    dates = [];
    sortedData.forEach(function(d)
    {
        dates.push(d["date"])
    });

    function sortDict(a, b)
    {
        as = a["date"].split("/");
        bs = b["date"].split("/");
        aDay = as[0];
        aMon = as[1];
        bDay = bs[0];
        bMon = bs[1];

        if (aMon < bMon)
        {
            return -1;
        }
        if (aMon > bMon)
        {
            return 1;
        }
        else
        {
            if (aDay < bDay)
            {
                return -1;
            }
            if (aDay > bDay)
            {
                return 1;
            }
        }
        return 0;
    }

    yScale = d3.scaleLinear()
             .domain([0, yMax])
             .range([height, 0]);
    
    var rangeArray = Array.from(Array(dates.length).keys());
    // var rectHeight = height/states.length;
    console.log(dates, rangeArray);

    var xScale = d3.scaleBand()
        .domain(dates) // input
        //.range([0, 4])
        //.padding([.1])
        .rangeRound([0, width]); // output
    // var xScale = d3.scaleOrdinal()
    //              .domain(dates)
    //              .range([0, width]);

    var svg = d3.select("#graphs").append("p").append(elementId).append("svg")
    .attr("width", width + 2 * margin.left)
    .attr("height", height + 2 * margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    x_adj = 30;
    sortedData.forEach(function(d){
        svg.append("rect")
        .attr("class", "tile")
        .attr("y", function(){ return yScale(d["count"]);})
        .attr("x", function(){ return xScale(d["date"]) + x_adj})
        .attr("height", height - yScale(d["count"]) )
        .attr("width", 15)
        .style("fill", "blue")
    });

}

//test displayBarChart
// testDisplayBarChart()

// d3.csv("dataset/opensky.csv").then(function(data){
//     console.log("opensky loaded: ", data.length);
// });

function testDisplayBarChart()
{
    testData = [
        {
            "date": "01/20",
            "airport": "KATL",
            "count":143
        },
        {
            "date": "01/21",
            "airport": "KATL",
            "count":70
        },
        {
            "date": "01/22",
            "airport": "KATL",
            "count":30
        },
        {
            "date": "01/23",
            "airport": "KATL",
            "count":20
        },
        {
            "date": "01/24",
            "airport": "KATL",
            "count":50
        },
        // {
        //     "date": "01/20",
        //     "airport": "BATL",
        //     "count":10
        // },
        // {
        //     "date": "01/21",
        //     "airport": "BATL",
        //     "count":15
        // },
        // {
        //     "date": "01/22",
        //     "airport": "BATL",
        //     "count":220
        // },
        // {
        //     "date": "01/23",
        //     "airport": "BATL",
        //     "count":50
        // },
        // {
        //     "date": "01/24",
        //     "airport": "BATL",
        //     "count":60
        // }
    ]

    console.log(testData);
    displayBarChart(testData, "test")

}

