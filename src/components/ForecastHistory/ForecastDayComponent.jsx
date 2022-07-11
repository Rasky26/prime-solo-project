// Import the used components
import DisplayForecastHistory from "./DisplayForecastHistory"


// Component that takes in the array of historical forecasts
// for a specific date.
//
// The first element of that array is seperated off and displayed
// as a top-level `<ul>` item. All other objects in that array
// are kept together and send along to the `<DisplayForecastHistory />`
// as a parameter for further logic / processing.
export default function ForecastDayComponent({ forecastHistoryArray }) {

  // Split off the first array from the others.
  // The top level array is the main object to show in the list.
  // All other objects in the array will be nested elements.
  const [primaryForecastHistoryObj, ...otherForecastHistoryArray] = forecastHistoryArray

  return (
    <DisplayForecastHistory
      key={primaryForecastHistoryObj.id}
      forecastHistoryObj={primaryForecastHistoryObj}
      additionalForecastHistoryArray={otherForecastHistoryArray}
    />
  )
}
