// Import the used components
import DisplayForecastHistory from "../ForecastHistoryDisplay/DisplayForecastHistory"


// Component that takes in a singular array for a location
// and for a `forecast_for_date`.
//
// The first element of that array is seperated off and displayed
// as a top-level `<ul>` item. All other objects in that array
// are kept together and send along to other components
// as a parameter for further logic / processing.
export default function ForecastDayComponent({ locationDateForecastHistoryArray }) {

  // Split off the first array from the others.
  // The top level array is the main object to show in the list.
  // All other objects in the array will be nested elements.
  const [primaryForecastHistoryObj, ...otherForecastHistoryArray] = locationDateForecastHistoryArray


  // Build the DOM elements
  return (
    <DisplayForecastHistory
      key={primaryForecastHistoryObj.id}
      forecastHistoryObj={primaryForecastHistoryObj}
      additionalForecastHistoryArray={otherForecastHistoryArray}
    />
  )
}
