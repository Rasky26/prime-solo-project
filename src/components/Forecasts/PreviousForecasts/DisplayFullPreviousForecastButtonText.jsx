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
    className="forecast-past-forecast-button"
    onClick={() => {
      // Set the initialValues to the previous forecast
      populateFormWithPreviousForecast(forecastValues)
      // Reset the Formik Form
      formik.resetForm()}}
    >
      <div>
        <p className="forecast-past-creation-date">{forecast.forecastCreationDateTime}</p>
        <div className="forecast-past-bold">{forecast.cloudCover}</div>
        {forecast.pop ?
          <div>PoP: <span className="forecast-past-bold">{forecast.pop}</span></div>
          :
          null
        }
        <div>High: <span className="forecast-past-bold">{forecast.highTemp}</span>, Low: <span className="forecast-past-bold">{forecast.lowTemp}</span></div>
        <div><span className="forecast-past-bold">{forecast.windString}</span></div>
      </div>

    </button>
  )
}