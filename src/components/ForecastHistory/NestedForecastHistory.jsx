// Import the used components
import DisplayForecastHistory from "./DisplayForecastHistory"


// Component that builds the nested forecast history that
// is contained within the main forecast history container
export default function NestedForecastHistory({ forecastHistoryArray }) {


  // Build the DOM elements
  return (
    (forecastHistoryArray.length > 0) ?
      <ul>
        {forecastHistoryArray.map(forecastHistoryObj => (
          <DisplayForecastHistory
            key={forecastHistoryObj.id}
            forecastHistoryObj={forecastHistoryObj}
            additionalForecastHistoryArray={[]}
          />
        ))}
      </ul>
      :
      null
  )
}