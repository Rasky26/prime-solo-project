// Import the used components
import GetForecastLocations from "./ListForecastLocations/GetForecastLocations"
import SearchForecastLocations from "./SetForecastLocations/SearchForecastLocations"

// Containing component for the various location
// components and forms that the user may need
// to utilize or edit.
export default function ForecastLocations() {

  // Build the DOM elements
  return (
    <section>

      {/*
      List of current tracked forecast locations the user
      has associated with their account
      */}
      <GetForecastLocations />
      
      {/* 
      Search area for adding locations to the user's
      stored location table
      */}
      <SearchForecastLocations />

    </section>
  )
}