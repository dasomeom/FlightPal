

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

    sendSQLQuery(sqlQuery, callbackFunc, data1 = null, data2 = null )
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
                if (data1 == null && data2 == null)
                    callbackFunc(data)
                else if(data1 != null && data2 == null)
                    callbackFunc(data, data1)
                else
                    callbackFunc(data, data1, data2)

            }
            else
            {
                // console.error(this.status, this.readyState)
            }

        }

        request.send(sqlQuery);
    }
    

    sleep(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    milesToMeters(miles)
    {
        return miles * 1609.34;
    }

    formatDate(date, joinString = '-') 
    {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join(joinString);
    }

    autocomplete(inp, arr1, arr2) 
    {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) 
        {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr1.length; i++) 
            {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr1[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) 
                {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr1[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr1[i].substr(val.length) + ", " + arr2[i];
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr1[i] + ", " +  arr2[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) 
        {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) 
            {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } 
            else if (e.keyCode == 38) 
            { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            }
            else if (e.keyCode == 13) 
            {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) 
                {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) 
        {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) 
        {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) 
            {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) 
        {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) 
            {
                if (elmnt != x[i] && elmnt != inp) 
                {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }


    groupBy = function(d, key) {
        // var retVal = [];
        return d.reduce(function(obj, x) {
            if(!obj.hasOwnProperty(x[key]))
            {
                obj[x[key]] = [];
            }
            obj[x[key]].push(x);

            return obj;
        }, {});
    };

    sumBy = function(d, key){
        var retVal = 0;
        d.forEach(function(x){
            //console.log(x);
            retVal = retVal + Number(x[key]);
        });
        
        return retVal;
    };
}