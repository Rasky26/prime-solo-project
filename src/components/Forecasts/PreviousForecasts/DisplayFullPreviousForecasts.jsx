// Import core libraries and function
import { format } from "date-fns"
import { useState } from 'react'
import { useSelector } from "react-redux"

// Import used components
import DisplayFullPreviousForecastButtonText from "./DisplayFullPreviousForecastButtonText"


// Component that will display a small version of the forecast
// that can be selected by the user. When selected, that small window
// will be used to populate the current forecast form.
export default function DisplayFullPreviousForecasts({
  populateFormWithPreviousForecast,
  locationId,
  forecastDate,
  formik,
}) {

  // Set the local state for the number of past forecasts to display.
  // Using state in case I want to have dynamic number of
  // forecasts shown.
  const [filterNumber, setFilterNumber] = useState(4)

  // Access the store and get the user's forecast history
  const forecastFieldHistory = useSelector(store => store.forecastHistory.userForecastHistory
    // Filter matching locations
    .filter(forecast => Number(forecast.location_id) === Number(locationId))
    // Filter matching date
    .filter(forecast => format(new Date(forecast.forecast_for_date), "yyyy-MM-dd") === format(forecastDate, "yyyy-MM-dd"))
  // // Limit the results (default is from local state)
  ).slice(0, filterNumber)


  // Build the DOM element
  return (
    <>
      {forecastFieldHistory.map(forecastValues => 

        // Call the component that builds the past forecast
        // button to the DOM
        <DisplayFullPreviousForecastButtonText
          key={forecastValues.id}
          // Drill down the function to reset the parent state
          populateFormWithPreviousForecast={populateFormWithPreviousForecast}
          // Pass the specific forecast values
          forecastValues={forecastValues}
          // Continue passing the formik props
          formik={formik}
        />

      )}
    </>
  )
}