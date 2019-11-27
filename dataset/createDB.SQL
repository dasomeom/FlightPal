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
                        -- OR lastseen==''
                        -- OR estarrivalairport==''
                        -- OR callsign==''
                        -- OR callsign NOT LIKE '%N'
                        OR estdepartureairport==estarrivalairport;

-- SELECT COUNT(*) FROM opensky;

-- Keep only the November registered aircraft
-- CREATE TABLE n_opensky AS SELECT * FROM opensky WHERE callsign LIKE 'N%';

--SELECT COUNT(*) FROM n_opensky;

-- Count and delete loop flights (having same dep and arr airport code)
--SELECT COUNT(*) FROM n_opensky WHERE estdepartureairport==estarrivalairport;
-- DELETE FROM n_opensky WHERE estdepartureairport==estarrivalairport;
--SELECT * FROM n_opensky;


--SELECT COUNT(*) FROM opensky_with_model;
DELETE FROM opensky_with_model WHERE type_act == 'Blim/Dirigible'
                                  OR type_act == 'Glider'
                                  OR type_act == 'Gyroplane'
                                  OR type_act == 'Rotorcraft'
                                  OR type_act == 'Weight-shift-control'
                                  OR type_act == '';

--SELECT COUNT(*) FROM opensky_with_model;
CREATE TABLE opensky_with_model_reduced AS SELECT * FROM opensky_with_model;
-- SELECT * FROM opensky_with_model_reduced;

INSERT INTO openskyByDates
SELECT strftime('%H', firstseen,'unixepoch') as Hour, date(firstseen,'unixepoch') as Date, estdepartureairport, count(estdepartureairport) as count 
FROM opensky
GROUP BY estdepartureairport, Date, Hour;

-- INSERT INTO openskyByHours
-- SELECT (date(firstseen,'unixepoch')||'_'||strftime('%H', firstseen,'unixepoch')) as dateHour, estdepartureairport, count(estdepartureairport) as count 
-- FROM opensky
-- GROUP BY estdepartureairport, dateHour;


SELECT COUNT(*) AS openskyCount FROM opensky;
SELECT COUNT(*) AS airportsCount FROM airports;
SELECT COUNT(*) AS airlinesCount FROM airlines;
SELECT COUNT(*) AS citiesCount FROM cities;
SELECT COUNT(*) AS datesCount FROM openskyByDates;
-- SELECT COUNT(*) AS n_openskyCount FROM n_opensky;
SELECT COUNT(*) AS reducedCount FROM  opensky_with_model_reduced;

