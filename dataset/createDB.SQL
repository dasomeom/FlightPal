.headers on
.separator ','

DROP TABLE IF EXISTS opensky;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS airlines;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS openskyByDates;
DROP TABLE IF EXISTS openskyByHours;
DROP TABLE IF EXISTS n_opensky;
DROP TABLE IF EXISTS opensky_with_model;
DROP TABLE IF EXISTS opensky_with_model_reduced;


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

create table openskyByDates(Hour text, Date text, estdepartureairport text, count integer);

create table opensky_with_model(icao24 text, firstseen integer, estdepartureairport text, lastseen integer,estarrivalairport text,callsign text,
	estdepartureairporthorizdistance integer, estdepartureairportvertdistance integer,	estarrivalairporthorizdistance integer,
    estarrivalairportvertdistance integer, departureairportcandidatescount integer, arrivalairportcandidatescount integer, day integer,
    model text, manufacturer_name text, type_act text);

.tables

.mode csv
.import ./opensky.csv opensky
.import ./airports.csv airports
.import ./airlines.csv airlines
.import ./worldcities.csv cities
.import ./opensky_with_model.csv opensky_with_model

DELETE FROM opensky WHERE icao24==''
                        OR firstseen==''
                        OR estdepartureairport==''
                        -- OR lastseen==''
                        -- OR estarrivalairport==''
                        -- OR callsign==''
                        -- OR callsign NOT LIKE '%N'
                        OR estdepartureairport==estarrivalairport;

DELETE FROM opensky_with_model WHERE type_act == 'Blim/Dirigible'
                                  OR type_act == 'Glider'
                                  OR type_act == 'Gyroplane'
                                  OR type_act == 'Rotorcraft'
                                  OR type_act == 'Weight-shift-control'
                                  OR type_act == '';

CREATE TABLE opensky_with_model_reduced AS SELECT * FROM opensky_with_model;

.output hourly.csv
SELECT strftime('%H', firstseen,'unixepoch') as Hour, date(firstseen,'unixepoch') as Date, estdepartureairport, count(estdepartureairport) as count 
FROM opensky
GROUP BY estdepartureairport, Date, Hour;

.output

SELECT COUNT(*) AS openskyCount FROM opensky;
SELECT COUNT(*) AS airportsCount FROM airports;
SELECT COUNT(*) AS airlinesCount FROM airlines;
SELECT COUNT(*) AS citiesCount FROM cities;
SELECT COUNT(*) AS datesCount FROM openskyByDates;
SELECT COUNT(*) AS reducedCount FROM  opensky_with_model_reduced;

--drop opensky table because we have gotton everything we need.
DROP TABLE IF EXISTS opensky; 

VACUUM;