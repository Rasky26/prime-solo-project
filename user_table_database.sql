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