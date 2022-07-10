-- ====================================================================
-- IMPORTANT!        RUN THIS SQL FILE FIRST!        IMPORTANT!
-- 
--
-- "user" DATABASE CREATION FILE
--
-- Run this file to construct the "user" table with set constraints
-- for anyone logging in.
--
-- Login requirements:
--   Valid email address
--   Password
--
--
-- IMPORTANT!        RUN THIS SQL FILE FIRST!        IMPORTANT!
-- ====================================================================
--
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
--
-- Create the "user" table to validate against "email" instead
-- of a "username". Create a DOMAIN to validate the email
-- address against. This DOMAIN checks isn't against the
-- official RFC 5322 standards.
--
-- Get the "citext" extension
CREATE EXTENSION citext;
-- Create a new DOMAIN to check email addresses against
-- (REF: https://www.postgresql.org/docs/current/sql-createdomain.html)
CREATE DOMAIN domain_email AS citext
    -- REGEX REF: https://emailregex.com/
	CHECK ( value ~ '^(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$' )
	CONSTRAINT limit_length CHECK (char_length(value) <= 255);


-- Create the "user" table
CREATE TABLE "user" (
	"id" SERIAL PRIMARY KEY,
	"email" domain_email UNIQUE NOT NULL,
	"password" VARCHAR (1000) NOT NULL
);


-- One-to-one table used to store various user settings
CREATE TABLE "user_settings" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INTEGER UNIQUE REFERENCES "user" ON DELETE CASCADE,
	"metric" BOOLEAN NOT NULL DEFAULT FALSE,
	"localization" VARCHAR(5) DEFAULT 'en_US'
);


-- Create the station location table
CREATE TABLE "asos_awos_us_locations" (
	"id" SERIAL PRIMARY KEY,
	"station" VARCHAR(4) UNIQUE NOT NULL,
	"name" VARCHAR(255),
	"state" VARCHAR(2),
	"timezone" VARCHAR(1),
	"daylight_saving" VARCHAR(1),
	"latitude" DECIMAL(9, 4) NOT NULL,
	"longitude" DECIMAL(9, 4) NOT NULL,
	"elevation" DECIMAL(9, 4)
);


-- Create the junction table for a user to have
-- many forecast locations. Only allows for unique
-- user and location combinations, as to not allow
-- redundant locations being saved with a user
CREATE TABLE "user_forecast_locations" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INTEGER REFERENCES "user" ON DELETE CASCADE,
	"location_id" INTEGER REFERENCES "asos_awos_us_locations" ON DELETE CASCADE,
	UNIQUE ("user_id", "location_id")
);


-- Create the forecast table.
-- Add additional constraints as you deem necessary:
CREATE TABLE "forecasts" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INTEGER REFERENCES "user" ON DELETE CASCADE,
	"location_id" INTEGER REFERENCES "asos_awos_us_locations" ON DELETE CASCADE,
	"forecast_for_date" DATE NOT NULL,
	"cloud_cover" INTEGER NOT NULL,
	"pop" INTEGER NOT NULL,
		CHECK("pop" BETWEEN 0 AND 100),
	"high_temp" DECIMAL(6, 2) NOT NULL,
		CHECK ("high_temp" > 0),
	"low_temp" DECIMAL(6, 2) NOT NULL,
		CHECK ("low_temp" > 0),
	"wind_speed_low" DECIMAL (5, 1) NOT NULL,
		CHECK ("wind_speed_low" >= 0),
	"wind_speed_high" DECIMAL (5, 1),
		CHECK ("wind_speed_high" >= 0),
	"wind_gust_low" DECIMAL (5, 1),
		CHECK ("wind_gust_low" >= 0),
	"wind_gust_high" DECIMAL (5, 1),
		CHECK ("wind_gust_high" >= 0),
	"wind_direction" INTEGER NOT NULL,
		CHECK ("wind_direction" BETWEEN 0 AND 15),
	"created_on" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);