// Import utility functions
import setForecastFieldsForDisplay from "../../Utilities/FormatForecastFields"


// Component that builds the button from various
// forecast values converted to display strings
export default function DisplayFullPreviousForecastButtonText({
  populateFormWithPreviousForecast,
  forecastValues,
  formik
}) {

  // Get the forecast variables converted to workable string values
  const forecast = setForecastFieldsForDisplay(forecastValues)


  // Build the DOM element
  return (
    <button
    key={forecastValues.id}
    type="button"
    onClick={() => {
      // Set the initialValues to the previous forecast
      populateFormWithPreviousForecast(forecastValues)
      // Reset the Formik Form
      formik.resetForm()}}
    >
      <div>
        <p>{forecast.forecastCreationDateTime}</p>
        <div>{forecast.cloudCover}</div>
        <div>{forecast.pop}</div>
        <div>{forecast.highTemp}</div>
        <div>{forecast.lowTemp}</div>
        <div>{forecast.windString}</div>
      </div>

    </button>
  )
}