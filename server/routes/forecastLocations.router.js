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