// Import the core libraries and functions
import { useSelector } from "react-redux"


// Component that shows the past day values for an individual
// input for the current forecast input
export default function DisplayVariableFromPreviousForecast() {

    const forecastFieldHistory = useSelector(store => store.userForecastHistory.userForecastHistory)

    // Buid the DOM elements
    return (
      <>
      </>
    )
}