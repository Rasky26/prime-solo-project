// Import the core libraries and functions
const fs = require('fs')
const { format } = require("date-fns")


// Initialize the current date
const currentDate = new Date()

// Set the start date at a week before the current date
const startDate = new Date(currentDate.setDate(currentDate.getDate() - 7))

// Set the end date for a week from now
const endDate = new Date(currentDate.setDate(currentDate.getDate() + 14))

// Duluth KDLH, Mankato MKMT, Minneapolis KMSP
const stationIds = [515, 1190, 1236]

// Reference temperatures, precipitation, and cloud cover values
const refTemperatureArray = [83, 86, 89, 97, 81, 83, 82, 77, 87, 90, 74, 80, 86]
const refPrecipArray = [4, 9, 1, 1, 1, 3, 2, 1, 1, 1, 7, 4, 1]
const refCloudCover = [4, 5, 1, 0, 1, 2, 1, 1, 4, 3, 5, 2, 1]

// Lazy-man's loop counter
let mainCount = 0
let subCount = 0

// Initialize the construction of the SQL query
let sqlQuery = `INSERT INTO "forecasts" (
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
  "wind_direction",
  "created_on"
)
VALUES`

// Get a windSpeedLow value of either 0, 5, or 10 randomly
function getwindValue() {

  // Set the value to a whole integer value
  return Math.round(
    // Fake a weighted function using cosign (being lazy...)
    Math.cos((
      // Get a random value between 0 and Math.PI
      Math.PI * Math.random()
    // Half the X range, which gives a Y-value between 1 and 0
    ) / 2)
    // Scale the Y-value to 2 to 0
    * 2)
  // And finally set a wind value of either 10, 5, or 0  
  * 5
}

// Set the loop to create the SQL data
//
// Start a week in the past of the current day and loop
// by a day each step until it is a week into the
// future from the current date
for (dayCount=0; dayCount<15; dayCount++) {

  // Initialize the subCount to the mainCount on each loop
  subCount = mainCount

  // Step the day forward by one (not sure why it works this way,
  // but let's keep moving...)
  const loopDate = new Date(startDate.setDate(startDate.getDate() + 1))

  // Set the value that will loop through a 7-day forecast 
  // for each step of the loop
  let weekLoopDate = new Date(loopDate)

  // Each day of the week, a met will produce a 7-day forecast,
  // so let's loop through those seven days without going past
  // the endDate value
  for (forecastCount=0; forecastCount<7; forecastCount++) {

    // Set the new loop value and add a day to each step of the loop
    weekLoopDate = new Date(weekLoopDate.setDate(weekLoopDate.getDate() + 1))

    // Set the low wind speed
    const windSpeedLow = getwindValue()
    // Set a range for the high wind speed
    const windSpeedHighRange = getwindValue()
    // If the variance is zero, set null
    const windSpeedHigh = windSpeedHighRange ? windSpeedLow + windSpeedHighRange : null
    // Set a low wind gust range
    const windGustLowCheck = getwindValue()
    // See if a wind gust should be set
    const windGustLow = windGustLowCheck > 5 ? windGustLowCheck + getwindValue() + 10 : null
    // Check if a high wind gust should be set
    const windGustHighCheck = windGustLow + getwindValue()
    // Set the high wind gust
    const windGustHigh = (!windGustLow || windGustLow >= windGustHighCheck) ? null : windGustHighCheck

    

    // If the date exceeds a week from the current date, stop
    // the loop. No forecasts past 7-days IMO.
    if (weekLoopDate > endDate) {
      break
    }

    // Loop through each station to put into the SQL file
    for (const station of stationIds) {

      // console.log(
      //   // "user_id"
      //   1,
      //   // "location_id"
      //   station,
      //   // "forecast_for_date" -- formatted
      //   format(weekLoopDate, "yyyy-MM-dd"),
      //   // "cloud_cover"
      //   refCloudCover[subCount],
      //   // "pop"
      //   // Add a random variance of +/-1
      //   refPrecipArray[subCount] + Math.round((Math.random() * 3) - 1.5),
      //   // "high_temp"
      //   // Add a random variance of +/-3
      //   refTemperatureArray[subCount] + Math.round((Math.random() * 7) - 3.5),
      //   // "low_temp"
      //   // Add a random variance of +/-3
      //   refTemperatureArray[subCount] - 20 + Math.round((Math.random() * 7) - 3.5),
      //   // "wind_speed_low"
      //   windSpeedLow,
      //   // "wind_speed_high"
      //   windSpeedHigh,
      //   // "wind_gust_low"
      //   windGustLow,
      //   // "wind_gust_high"
      //   windGustHigh,
      //   // "wind_direction"
      //   10 + Math.round((Math.random() * 7) - 3.5),
      //   // "created_on"
      //   format(new Date(loopDate.setMinutes(loopDate.getMinutes() + Math.round((Math.random() * 7) - 3.5))), "yyyy-MM-dd hh:mm:ss")
      // )

      sqlQuery += `
  ('1', '${station}', '${format(weekLoopDate, "yyyy-MM-dd")}', '${refCloudCover[subCount]}', '${(refPrecipArray[subCount] + Math.round((Math.random() * 3) - 1.5)) * 10}', '${refTemperatureArray[subCount] + Math.round((Math.random() * 7) - 3.5)}', '${refTemperatureArray[subCount] - 20 + Math.round((Math.random() * 7) - 3.5)}', ${windSpeedLow}, ${windSpeedHigh}, ${windGustLow}, ${windGustHigh}, '${10 + Math.round((Math.random() * 7) - 3.5)}', '${format(new Date(loopDate.setMinutes(loopDate.getMinutes() + Math.round((Math.random() * 7) - 3.5))), "yyyy-MM-dd hh:mm:ss")}'),`
    }

    // Increment the subCount by one
    subCount++
  }

  // Increment the mainCount by one
  mainCount++
}

// Find the last comma in this giant string and replace it with the closing
// values for our SQL insert statement
const lastCommaIndex = sqlQuery.lastIndexOf(',')
sqlQuery = sqlQuery.substring(0, lastCommaIndex) + `;`

console.log(sqlQuery)

// Write to the SQL file
fs.writeFile(
  "wx_forecast_database_dump.sql", sqlQuery,
  // Check for errors on the write / document
  function(err) {
    if(err) {
      return console.log(err)
    }
  }
)