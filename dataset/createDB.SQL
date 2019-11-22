.headers on
.separator ','

DROP TABLE IF EXISTS opensky;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS airlines;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS n_opensky;


-- Create tables
create table opensky(icao24 text, firstseen integer, estdepartureairport text, lastseen integer,estarrivalairport text,callsign text,
	estdepartureairporthorizdistance integer, estdepartureairportvertdistance integer,	estarrivalairporthorizdistance integer,	
    estarrivalairportvertdistance integer, departureairportcandidatescount integer, arrivalairportcandidatescount integer, day integer);

create table airports(count integer,	airportname text, city text, country text, iata text,
            icao text, latitude real, longitude real, elevation integer, utc integer,
            dst text, region text, type text, db text);
 
create table airlines(count integer, name text, ign text, iata text, icao text, 
            altname	text, country text, active text);           

--create table cities(city text, city_ascii text,	lat	real, lng real, country text, iso2 text, iso3 text,	admin_name text, capital text, population integer, id integer);

--.tables


.mode csv
.import ./opensky.csv opensky
.import ./airports.csv airports
.import ./airlines.csv airlines
--.import ./worldcities.csv cities

--SELECT COUNT(*) FROM opensky;
--SELECT COUNT(*) FROM airports;
--SELECT COUNT(*) FROM airlines;
--SELECT COUNT(*) FROM cities

-- Count how many rows have null values in at least one of the 6 first columns
--SELECT COUNT(*) FROM opensky WHERE icao24==''
--                                OR firstseen==''
--                                OR estdepartureairport==''
--                                OR lastseen==''
--                                OR estarrivalairport==''
--                                OR callsign=='';

-- Create cleaned table from opensky.csv having non null values in first 6 columns
DELETE FROM opensky WHERE icao24==''
                                OR firstseen==''
                                OR estdepartureairport==''
                                OR lastseen==''
                                OR estarrivalairport==''
                                OR callsign=='';

--SELECT COUNT(*) FROM opensky;

-- Keep only the November registered aircraft
CREATE TABLE n_opensky AS SELECT * FROM opensky WHERE callsign LIKE 'N%';

--SELECT COUNT(*) FROM n_opensky;

-- Count and delete loop flights (having same dep and arr airport code)
--SELECT COUNT(*) FROM n_opensky WHERE estdepartureairport==estarrivalairport;
DELETE FROM n_opensky WHERE estdepartureairport==estarrivalairport;
--SELECT COUNT(*) FROM n_opensky;
SELECT * FROM n_opensky;


