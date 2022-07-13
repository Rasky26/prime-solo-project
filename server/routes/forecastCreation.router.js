// Import the core libraries and functions
const express = require("express")
const { rejectUnauthenticated } = require("../modules/authentication-middleware")
const pool = require("../modules/pool")

// Main router element to make requests to
const router = express.Router()

// Import the wind-speed regex module
const { getWindSpeedValues } = require("../utils/wind-speed-regex")


// POST route to add a new location to the user's list
// of tracked stations
router.post("/", rejectUnauthenticated, (req, res) => {

  // Get the specific user and the new station ID
  const userId = req.user.id
  const forecastValues = req.body

  // Use REGEX to break apart the wind string to the
  // specific values in an array
  const windMatches = getWindSpeedValues(forecastValues.wind_speed)
  // const windMatches = forecast.wind_speed.match(/^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/)

  // Set the individual wind speed values
  // const windSpeedLow = windMatches[1] ? windMatches[1] : 0
  // const windSpeedHigh = windMatches[2] ? windMatches[2] : null
  // const windGustLow = windMatches[4] ? windMatches[4] : null
  // const windGustHigh = windMatches[5] ? windMatches[5] : null

  // Create the SQL query
  const sqlQuery = `
    INSERT INTO "forecasts" (
      "user_id",
      "location_id",
      "forecast_for_date",
      "cloud_cover",
      "pop",
      "high_temp",
      "low_temp",
      "wind_speed_low",
      "wind_speed_high",
      "wind_gust_low",
      "wind_gust_high",
      "wind_direction"
    )
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
  `

  // Create the SQL parameters
  const sqlParams = [
    userId,
    forecastValues.locationId,
    forecastValues.forecastDate,
    forecastValues.cloud_cover,
    forecastValues.pop,
    forecastValues.high_temp,
    forecastValues.low_temp,
    windMatches.windSpeedLow,
    windMatches.windSpeedHigh,
    windMatches.windGustLow,
    windMatches.windGustHigh,
    forecastValues.wind_direction,
  ]

  // // Send the request to the DB
  pool.query(sqlQuery, sqlParams)
  .then(() => res.sendStatus(201))
  .catch((err) => {
    console.log(`Error in forecastLocations "/add-station" POST with ${err}`)
    res.sendStatus(500)
  })
})


// POST route to add a new location to the user's list
// of tracked stations
router.put("/:id", rejectUnauthenticated, (req, res) => {

  // Get the forecast ID from the params
  const forecastId = req.params.id
  const forecastValues = req.body

  // Use REGEX to break apart the wind string to the
  // specific values in an array
  const windMatches = getWindSpeedValues(forecastValues.wind_speed)
  // const windMatches = forecastValues.wind_speed.match(/^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/)

  // // Set the individual wind speed values
  // const windSpeedLow = windMatches[1] ? windMatches[1] : 0
  // const windSpeedHigh = windMatches[2] ? windMatches[2] : null
  // const windGustLow = windMatches[4] ? windMatches[4] : null
  // const windGustHigh = windMatches[5] ? windMatches[5] : null

  // Create the SQL query
  const sqlQuery = `
    UPDATE "forecasts"
    SET 
      "cloud_cover" = $2,
      "pop" = $3,
      "high_temp" = $4,
      "low_temp" = $5,
      "wind_speed_low" = $6,
      "wind_speed_high" = $7,
      "wind_gust_low" = $8,
      "wind_gust_high" = $9,
      "wind_direction" = $10
    WHERE id = $1;
  `


  // Set the SQL parameters
  const sqlParams = [
    forecastId,
    forecastValues.cloud_cover,
    forecastValues.pop,
    forecastValues.high_temp,
    forecastValues.low_temp,
    windMatches.windSpeedLow,
    windMatches.windSpeedHigh,
    windMatches.windGustLow,
    windMatches.windGustHigh,
    forecastValues.wind_direction,
  ]

  // Make the PUT request to the database
  pool.query(sqlQuery, sqlParams)
  .then(() => res.sendStatus(201))
  .catch(err => {
    console.log(`Error in forecast PUT with: ${err}`)
    res.sendStatus(500)
  })
})


module.exports = router