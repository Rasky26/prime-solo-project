// Helper function that takes in the user's forecast
// history array and then structures those forecasts
// based on their location ID and then creates nested
// array based on the `forecast_for_date` for that
// specific location
export default function reshapeUserForecastHistory(userForecastHistory) {


  // Initialize the output object
  const structedForecastHistory = {}

  // Array of unique location IDs
  const uniqueLocations = [
    ...new Set(userForecastHistory.map(
      forecastHistoryObj => forecastHistoryObj.location_id)
    )
  ]

  // Loop over the different location ID's to generate
  // an array of forecasts for that specific location
  for (const locationId of uniqueLocations) {

    // Create an array containing only forecasts for the
    // current loop's location ID
    const forecastByLocationArray = userForecastHistory.filter(
      forecastHistoryObj => forecastHistoryObj.location_id === locationId
    )

    // Get a list of the unique `forecast_for_date` fields
    // in an array
    const uniqueDates = [...new Set(forecastByLocationArray.map(
      forecastHistoryObj => forecastHistoryObj.forecast_for_date))
    ]

    // Create nested arrays where each `forecast_for_date` is
    // grouped together in the nested array. This will allow
    // for easier iteration over the main array to display the
    // various forecasts to the DOM
    //
    // Loop over the unique dates
    structedForecastHistory[locationId] = uniqueDates.map(
      // Put matching dates into their own array...
      date => forecastByLocationArray.filter(
        // ...where the matching date matches the unique filter date
        forecastByLocation => forecastByLocation.forecast_for_date === date
      )
    )
  }

  // Return this structured object with forecast arrays
  return structedForecastHistory
}