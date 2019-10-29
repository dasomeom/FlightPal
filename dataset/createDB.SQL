.headers on
.separator ','

DROP TABLE IF EXISTS opensky;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS airlines;


-- Create tables
create table opensky(icao24 text, firstseen integer, estdepartureairport text, lastseen integer,estarrivalairport text,callsign text,
	estdepartureairporthorizdistance integer, estdepartureairportvertdistance integer,	estarrivalairporthorizdistance integer,	
    estarrivalairportvertdistance integer, departureairportcandidatescount integer, arrivalairportcandidatescount integer, day integer);

create table airports(count integer,	airportname text, city text, country text, iata text,
            icao text, latitude real, longitude real, elevation integer, utc integer,
            dst text, region text, type text, db text);
 
create table airlines(count integer, name text, ign text, iata text, icao text, 
            altname	text, country text, active text);           


.tables


.mode csv
.import ./opensky.csv opensky
.import ./airports.csv airports
.import ./airlines.csv airlines

SELECT COUNT(*) FROM opensky;
SELECT COUNT(*) FROM airports;
SELECT COUNT(*) FROM airlines;


