// Import core libraries and function
import { format } from "date-fns"
import { useSelector } from "react-redux"

// Import used utility functions
import setForecastFieldsForDisplay from "../../Utilities/FormatForecastFields"

// Import the used components
import DisplayVariableButtonFromPreviousForecast from "./DisplayVariableButtonFromPreviousForecast"


// Component that shows the past day values for an individual
// input for the current forecast input
export default function DisplayVariableFromPreviousForecast({ pushSpecificValueToInput, locationId, forecastDate, currentInputName }) {

  // Function that takes the filtered results and then further
  // reduces those results so only the latest forecast value for
  // each day is returned from that array.
  // The ordering was already done by the DB, so this only needs
  // to find the first instance of that date, get the pertinent
  // key-value fields, and return the resultant array
  function reduceArrayToSingularDatesWithRequestedValue(forecastArray) {

    // Check for an empty array
    if (forecastArray.length < 1) {
      return []
    }

    // Initialize the output array that will contain the list of objects
    const reducedArray = []
    const dateValues = []

    // Loop through the list and aggregate results
    for (const forecast of forecastArray) {

      const forecastStringFields = setForecastFieldsForDisplay(forecast)
      // console.log("?????????", forecastStringFields)

      // Get the date string of the current forecast object: "YYYY-MM-DD" format
      const currentDate = format(new Date(forecast.created_on), "yyyy-MM-dd")

      // Check if this is a new date value
      if (!dateValues.includes(currentDate)) {
        // Add that date to the tracked `dateValues` array
        dateValues.push(currentDate)

        // Initialize an output value
        let outputValue
        let outputString

        // Set the switch statement to determine which field to populate
        // into the output array
        switch (currentInputName) {
          case "cloud_cover":
            outputValue = forecast.cloud_cover
            outputString = forecastStringFields.cloudCover
            break
          case "pop":
            outputValue = forecast.pop
            outputString = forecastStringFields.pop
            break
          case "high_temp":
            outputValue = Math.round(forecast.high_temp)
            outputString = forecastStringFields.highTemp
            break
          case "low_temp":
            outputValue = Math.round(forecast.low_temp)
            outputString = forecastStringFields.lowTemp
            break
          case "wind_speed":
            outputValue = forecastStringFields.windSpeed
            outputString = forecastStringFields.windSpeed
            break
          case "wind_direction":
            outputValue = forecast.wind_direction
            outputString = forecastStringFields.windDirection
            break
          default:
            return
          }
        
        // Create an output object and add it to the output `reducedArray`
        reducedArray.push({
          // Push the ID to keep React happy
          id: forecast.id,
          // Send the `created_on` date back, formatted
          created_on: format(new Date(forecast.created_on), "MMM dd, yyyy - h:mm aaa"),
          // Set the current field
          field: currentInputName,
          // Build the forecast value and string into the object
          value: outputValue,
          string: outputString,
        })
      }
    }

    // Send back the `reducedArray` containing the last forecast value in
    // the day for each day available
    return reducedArray
  }

  const forecastElementHistory = useSelector(store => store.forecastHistory.userForecastHistory
    // Filter matching locations
    .filter(forecast => Number(forecast.location_id) === Number(locationId))
    // Filter matching date
    .filter(forecast => format(new Date(forecast.forecast_for_date), "yyyy-MM-dd") === format(forecastDate, "yyyy-MM-dd"))
  )


  const dailyForecastElementHistory = reduceArrayToSingularDatesWithRequestedValue(forecastElementHistory)

  // Buid the DOM elements
  return (
    <ul className="past-daily-forecast-list">
      {dailyForecastElementHistory.map(dailyForecastElement =>
        <DisplayVariableButtonFromPreviousForecast
          key={dailyForecastElement.id}
          pushSpecificValueToInput={pushSpecificValueToInput}
          dailyForecastElement={dailyForecastElement}
        />  
      )}
    </ul>
  )
}