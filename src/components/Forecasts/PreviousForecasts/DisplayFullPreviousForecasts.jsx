// Import utility functions
import setForecastFieldsForDisplay from "../../Utilities/FormatForecastFields"


// Component that will display a small version of the forecast
// that can be selected by the user. When selected, that small window
// will be used to populate the current forecast form.
export default function DisplayFullPastForecast({ forecastValues }) {

    // Get the forecast variables converted to workable string values
    const forecast = setForecastFieldsForDisplay(forecastValues)

    // Build the DOM element
    return (
        <div>
            <p>{forecast.forecastCreationDateTime}</p>
            <div>{forecast.cloudCover}</div>
            <div>{forecast.pop}</div>
            <div>{forecast.highTemp}</div>
            <div>{forecast.lowTemp}</div>
            <div>{forecast.windString}</div>
        </div>
    )
}