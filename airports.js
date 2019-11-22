function demoAirportsMap()
{
    bounds  = new google.maps.LatLngBounds();
    var KATLAirport;
    airports.forEach(function(d){
        if(d["icao"] == "KATL")
        {
            KATLAirport = d;
        }
    });         
    var katlLatLong = new google.maps.LatLng(KATLAirport["latitude"],KATLAirport["longitude"]);
    console.log(katlLatLong,KATLAirport["latitude"],KATLAirport["longitude"]);
    var depMarker = new google.maps.Marker({
        position: katlLatLong,
        map: airportsMapHandler,
    });
    loc = new google.maps.LatLng(depMarker.position.lat(), depMarker.position.lng());
    airportsMapHandler.setCenter(katlLatLong);
    airportsMapHandler.setZoom(6);
}