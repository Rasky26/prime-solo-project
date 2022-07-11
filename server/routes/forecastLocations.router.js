// Import the core libraries and functions
const express = require('express')
const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const encryptLib = require('../modules/encryption')
const pool = require('../modules/pool')
const userStrategy = require('../strategies/user.strategy')
const { route } = require('./user.router')


// Main router element to make requests to
const router = express.Router()


// GET route to return a list of the user's forecast locations
router.get("/", rejectUnauthenticated, (req, res) => {

  // Build the SQL query
  const sqlQuery = `
    SELECT 
      "asos_awos_us_locations".id,
      "asos_awos_us_locations".station,
      "asos_awos_us_locations".name,
      "asos_awos_us_locations".state,
      "asos_awos_us_locations".timezone,
      "asos_awos_us_locations".daylight_saving,
      "asos_awos_us_locations".latitude,
      "asos_awos_us_locations".longitude,
      "asos_awos_us_locations".elevation
    FROM "asos_awos_us_locations"
    JOIN "user_forecast_locations"
      ON "asos_awos_us_locations".id = "user_forecast_locations".location_id
    JOIN "user"
      ON "user".id = "user_forecast_locations".user_id
    WHERE "user".id = $1
    ORDER BY "asos_awos_us_locations".station ASC;
  `

  // Set the SQL parameters
  const sqlParams = [
    req.user.id,
  ]

  // Call the database with the query and parameters
  pool.query(sqlQuery, sqlParams)
  // Return the successful results
  .then((result) => res.send(result.rows))
  // Signal if an error occurred
  .catch(err => {
    console.log(`Error in forecastLocations GET with ${err}`)
    res.send(500)
  })
})


// Route that allows a user to search the database
// for any matching results
router.get("/:searchTerm", rejectUnauthenticated, (req, res) => {

  // Build the SQL query with case-independent parameters
  const sqlQuery = `
    SELECT *
    FROM "asos_awos_us_locations"
    WHERE "station" ILIKE $1
      OR "name" ILIKE $1
      OR "state" ILIKE $1
    ORDER BY station;
  `

  // Allow users search for any part of the string by
  // use the `%` around the query parameters
  const sqlParams = [
    `%${req.params.searchTerm}%`,
  ]

  // Make the query to the database
  pool.query(sqlQuery, sqlParams)
  .then((result) => res.send(result.rows))
  .catch((err) => {
    console.log(`Error in GET search request with ${err}`)
    res.sendStatus(500)
  })
})


// POST route to add a new location to the user's list
// of tracked stations
router.post("/add-station", rejectUnauthenticated, (req, res) => {

  // Get the specific user and the new station ID
  const userId = req.user.id
  const stationId = req.body.stationId

  // Create the SQL query
  const sqlQuery = `
    INSERT INTO "user_forecast_locations"
      ("user_id", "location_id")
    VALUES
      ($1, $2);
  `

  // Create the SQL params array
  const sqlParams = [
    userId,
    stationId,
  ]

  // Send the request to the DB
  pool.query(sqlQuery, sqlParams)
  .then(() => res.sendStatus(201))
  .catch((err) => {

    // If the record already exists, then just send a 200 response
    if (err.detail === `Key (user_id, location_id)=(${userId}, ${stationId}) already exists.`) {
      res.sendStatus(200)
    }
    // Otherwise, an error has occurred, so log it
    else {
      console.log(`Error in forecastLocations "/add-station" POST with ${err}`)
      res.sendStatus(500)
    }
  })

})


// DELETE route to remove a location from the user's stored
// location list
router.delete("/:id", rejectUnauthenticated, (req, res) => {

  // Get the specific user and location information for the SQL params
  const userId = req.user.id
  const locationId = req.params.id

  // Create the SQL query
  const sqlQuery = `
    DELETE FROM "user_forecast_locations"
    WHERE "user_id" = $1
    AND "location_id" = $2;
  `

  // Create the SQL params array
  const sqlParams = [
    userId,
    locationId,
  ]

  // Send the request to the DB
  pool.query(sqlQuery, sqlParams)
  .then(() => res.sendStatus(204))
  .catch((err) => {
    console.log(`Error in forecastLocations DELETE with ${err}`)
    res.sendStatus(500)
  })
})



module.exports = router