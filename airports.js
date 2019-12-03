var heatmapData = {};

function demoHeatMap()
{
    var heatMapData = [
        {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
        new google.maps.LatLng(37.782, -122.445),
        {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
        {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
        {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
        new google.maps.LatLng(37.782, -122.437),
        {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},
    
        {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
        {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
        new google.maps.LatLng(37.785, -122.443),
        {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
        new google.maps.LatLng(37.785, -122.439),
        {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
        {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
    ];
    
    var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
    console.log(heatMapHandler);
    heatMapHandler.setCenter(sanFrancisco);
    heatMapHandler.setZoom(13);
    heatMapHandler.setMapTypeId('satellite');

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData
      });
    heatmap.setMap(heatMapHandler);
}

var heatMapData;
var heatmap = undefined;
function searchHeatmap(event)
{
    clearHeatMap();
    if (event != undefined)
    {
        event.preventDefault();
    }
    console.log(event);

    ds = heatmapDateHandle.value.split("-");
    heatmapDate =  new Date(ds[0], ds[1]-1, ds[2]);
    d = heatmapDate.getDate();
    m = heatmapDate.getMonth() + 1;
    y = heatmapDate.getFullYear();
    now = new Date();
    heatmapDateValid = (d > 0 && d < 32 && m >= 0 && m < 13 && heatmapDate >= now);

    if(heatmapDateValid)
    {
        document.getElementById("heatmapDateError").innerHTML = "";
        hmDateData = searchHourlyData(databaseYear + "-" + ds[1] + "-" + ds[2]);
        heatmapData = myUtil.groupBy(hmDateData, "Hour");
        hourChangeHandler();        
    }
    else
    {
        document.getElementById("heatmapDateError").innerHTML = "Invalid date";
        document.getElementById("heatmapDateError").style.color = "red";
    }
}

function heatmapDateHandler()
{
    document.getElementById("heatmapDateError").innerHTML = "";
    clearHeatMap();
    heatmapData = [];
    heatmap = undefined;
    searchHeatmap();
}

function hourChangeHandler()
{
    setHeatmapSearchState(false);
    thisHour = document.getElementById("UTCHour").value;
    thisHour = thisHour > 9 ? String(thisHour) : "0" + String(thisHour);
    thisHourData = heatmapData[thisHour];
    console.log(thisHour, heatmapData);
    if(thisHourData != undefined && thisHourData.length > 0)
    {
        drawHeatmapData(thisHourData);
    }
    setHeatmapSearchState(true);
}

function clearHeatMap()
{
    if(heatmap != undefined)
    {
        heatmap.setMap(null);
    }
}

function drawHeatmapData(hmData)
{
    thisHeatmapData = [];
    d = hmData[0];
    
    clearHeatMap();
    hmData.forEach(function(d){
        ap = airportsDict[d["estdepartureairport"]];
        if (ap != undefined)
        {
            ap = ap[0];
            APLatLong = new google.maps.LatLng(ap["latitude"], ap["longitude"]);
            thisEntry = {
                location: APLatLong, 
                weight : Math.log(d["count"])
            };
            thisHeatmapData.push(thisEntry);
        }
    });
    
    console.log(thisHeatmapData);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: thisHeatmapData
      });

  
    heatmap.setMap(heatMapHandler);
    
    setHeatmapSearchState(true);

}

function heatmapStyleHandler()
{
    sel = document.getElementById("heatmapStyle").value;
    heatMapHandler.setOptions({
        styles: selToStyle[sel]
    });
}