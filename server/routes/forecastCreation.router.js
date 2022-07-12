// Import the core libraries and functions
const express = require('express')
const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const pool = require('../modules/pool')

// Main router element to make requests to
const router = express.Router()



// POST route to add a new location to the user's list
// of tracked stations
router.post("/", rejectUnauthenticated, (req, res) => {

  // Get the specific user and the new station ID
  const userId = req.user.id
  const forecast = req.body

  // Use REGEX to break apart the wind string to the
  // specific values in an array
  const windMatches = forecast.wind_speed.match(/^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/)

  // Set the individual wind speed values
  const windSpeedLow = windMatches[1] ? windMatches[1] : 0
  const windSpeedHigh = windMatches[2] ? windMatches[2] : null
  const windGustLow = windMatches[4] ? windMatches[4] : null
  const windGustHigh = windMatches[5] ? windMatches[5] : null

  // Create the SQL query
  const sqlQuery = `
    INSERT INTO "forecasts"
      ("user_id", "location_id", "forecast_for_date", "cloud_cover", "pop", "high_temp", "low_temp", "wind_speed_low", "wind_speed_high", "wind_gust_low", "wind_gust_high", "wind_direction")
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
  `

  // Create the SQL parameters
  const sqlParams = [
    userId, forecast.locationId, forecast.forecastDate, forecast.cloud_cover, forecast.pop, forecast.high_temp, forecast.low_temp, windSpeedLow, windSpeedHigh, windGustLow, windGustHigh, forecast.wind_direction,
  ]

  // // Send the request to the DB
  pool.query(sqlQuery, sqlParams)
  .then(() => res.sendStatus(201))
  .catch((err) => {
    console.log(`Error in forecastLocations "/add-station" POST with ${err}`)
    res.sendStatus(500)
  })
})


module.exports = router