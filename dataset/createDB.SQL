.headers on
.separator ','

DROP TABLE IF EXISTS opensky;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS airlines;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS openskyByDates;


-- Create tables
create table opensky(icao24 text, firstseen integer, estdepartureairport text, lastseen integer,estarrivalairport text,callsign text,
	estdepartureairporthorizdistance integer, estdepartureairportvertdistance integer,	estarrivalairporthorizdistance integer,	
    estarrivalairportvertdistance integer, departureairportcandidatescount integer, arrivalairportcandidatescount integer, day integer);

create table airports(count integer,	airportname text, city text, country text, iata text,
            icao text, latitude real, longitude real, elevation integer, utc integer,
            dst text, region text, type text, db text);
 
create table airlines(count integer, name text, ign text, iata text, icao text, 
            altname	text, country text, active text);           

create table cities(city text, city_ascii text,	lat	real, lng real, country text, iso2 text, iso3 text,	admin_name text, capital text, population integer, id integer);

create table openskyByDates(Date text, estdepartureairport text, count integer);

.tables


.mode csv
.import ./opensky.csv opensky
.import ./airports.csv airports
.import ./airlines.csv airlines
.import ./worldcities.csv cities



INSERT INTO openskyByDates
SELECT date(firstseen,'unixepoch') as Date, estdepartureairport, count(estdepartureairport) as count 
FROM opensky
GROUP BY estdepartureairport, Date;


SELECT COUNT(*) FROM opensky;
SELECT COUNT(*) FROM airports;
SELECT COUNT(*) FROM airlines;
SELECT COUNT(*) FROM cities;
SELECT COUNT(*) FROM openskyByDates;
