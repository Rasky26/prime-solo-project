// Import the used components
import ForecastForm from "./ForecastForm"


// Component that takes in an array of forecast dates
// and places an individual forecast form for each
// of those dates
export default function ForecastFormForDates({ locationId }) {

  // Set the forecast date range.
  // Currently hard-coded to seven (7) days, but would be
  // easy enough to allow that value to be set by the user.
  //
  // Initialize the current date output array
  const forecastingDateRange = []
  // Get the current local datetime
  const startDate = new Date()
  // Create an array of the next seven days
  for (let i = 0; i < 1; i++) {
    let newDate = new Date(startDate)
    newDate.setDate(newDate.getDate() + i)
    forecastingDateRange.push(newDate)
  }


  // Build the DOM elements
  return (
    <>
    {forecastingDateRange.map(forecastingDate => (
      <ForecastForm
        key={forecastingDate}
        locationId={locationId}
        forecastDate={forecastingDate}
      />
    ))}
    </>
  )
}