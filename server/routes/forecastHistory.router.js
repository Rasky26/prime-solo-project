// Import the core libraries and functions
const express = require('express')
const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const encryptLib = require('../modules/encryption')
const pool = require('../modules/pool')
const userStrategy = require('../strategies/user.strategy')
const { route } = require('./user.router')

// Main router element to make requests to
const router = express.Router()


// Route to get the past two weeks of forecasts
// made by the current user
router.get("/", rejectUnauthenticated, (req, res) => {

  // Build the SQL query
  const sqlQuery = `
    SELECT * FROM "forecasts"
    WHERE "user_id" = $1
      AND "forecast_for_date" > (CURRENT_DATE - INTERVAL '14 days')
    ORDER BY
      "forecast_for_date" DESC,
      "created_on" DESC;
  `

  // Set the SQL params
  const sqlParams = [
    req.user.id,
  ]

  // Query the DB for forecasts from the last two weeks
  pool.query(sqlQuery, sqlParams)
  .then(results => res.send(results.rows))
  .catch(err => {
    console.log(`Error in getForecastHistory with ${err}`)
    res.sendStatus(500)
  })
})


module.exports = router