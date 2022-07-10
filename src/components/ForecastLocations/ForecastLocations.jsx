// Import the used components
import GetForecastLocations from "./ListForecastLocations/GetForecastLocations"

// Containing component for the various location
// components and forms that the user may need
// to utilize or edit.
export default function ForecastLocations() {

  // Build the DOM elements
  return (
    // List of current tracked forecast locations the user
    // has associated with their account
    <GetForecastLocations />
  )
}