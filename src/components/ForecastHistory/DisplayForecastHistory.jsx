// Import the core libraries and functions
import { format } from "date-fns"
import { useSelector } from "react-redux"

// Import the used components
import NestedForecastHistory from "./NestedForecastHistory"


// Component that displays the forecast history for the
// various dates.
//
// Takes in the current `forecastHistoryObj` that will be
// rendered to the DOM.
// If an array of forecast history objects is passed in via
// the `additionalForecastHistoryArray` param, that will
// be processed within the containing `<li>` element that
// will keep all the dates together.
export default function DisplayForecastHistory({ forecastHistoryObj, additionalForecastHistoryArray }) {

  // Get the cloud cover STORE values from REDUX
  const cloudCoverList = useSelector(store => store.config.cloudCover)
  // Get the wind direction STORE values from REDUX
  const windDirectionList = useSelector(store => store.config.windDirection)

  // Function that handles building the wind speed string
  const buildWindSpeedString = (
    windSpeedLow,
    windSpeedHigh,
    windGustLow,
    windGustHigh
  ) => {
    // Check for calm conditions ( <5mph )
    if (windSpeedLow === 'Calm') {
      return windSpeedLow
    }

    // See if a `windSpeedHigh` value does not exist (set to zero (0))
    if (windSpeedHigh < windSpeedLow) {
      return `${windSpeedLow}mph`
    }

    // Check if a `windGustLow` value exists (set to zero (0) if not supplied)
    if (windGustLow < windSpeedHigh) {
      return `${windSpeedLow} - ${windSpeedHigh}mph`
    }

    // Check if a `windGustHigh` value exists (set to zero (0) if not supplied)
    if (windGustHigh < windGustLow) {
      return `${windSpeedLow} - ${windSpeedHigh}mph G${windGustLow}`
    }

    // Otherwise, return the full wind speed string
    return `${windSpeedLow} - ${windSpeedHigh}mph G${windGustLow} - ${windGustHigh}`
  }

  // -------------------------------------------------------
  // Initialize all the output text values
  //
  // Build the `forecast_for_date` string
  // date-fns REF: https://date-fns.org/v2.24.0/docs/format
  const forecastForDate = format(new Date(forecastHistoryObj.forecast_for_date), "E. MMM dd, yyyy")
  // Set the high and low temperature fields
  const highTemp = `${Math.round(forecastHistoryObj.high_temp)}°F`
  const lowTemp = `${Math.round(forecastHistoryObj.low_temp)}°F`
  // Set the possibility of precipitation percentage
  const pop = (forecastHistoryObj.pop) ? `${forecastHistoryObj.pop}%` : null
  // Set the cloud cover (current just a string)
  const cloudCover = cloudCoverList.find(cloud => cloud.id === forecastHistoryObj.cloud_cover).name
  // Construct the wind string
  const windSpeedLow = (Math.round(forecastHistoryObj.wind_speed_low)) ? Math.round(forecastHistoryObj.wind_speed_low) : 'Calm'
  const windSpeedHigh = (Math.round(forecastHistoryObj.wind_speed_high)) ? Math.round(forecastHistoryObj.wind_speed_high) : 0
  const windGustLow = (Math.round(forecastHistoryObj.wind_gust_low)) ? Math.round(forecastHistoryObj.wind_gust_low) : 0
  const windGustHigh = (Math.round(forecastHistoryObj.wind_gust_high)) ? Math.round(forecastHistoryObj.wind_gust_high) : 0
  // If the wind speed is not calm, continue constructing the wind string
  const windSpeed = buildWindSpeedString(windSpeedLow, windSpeedHigh, windGustLow, windGustHigh)
  // Get the wind direction
  const windDirection = windDirectionList.find(wind => wind.id === forecastHistoryObj.wind_direction).abbreviation
  // String stating when the forecast was created
  const forecastCreationDate = format(new Date(forecastHistoryObj.created_on), "MMM dd, yyyy @ h:mmbb")
  // -------------------------------------------------------


  // Build the DOM elements
  return (
    <li>
      <div>
        {forecastForDate}
      </div>
      <div>
        {highTemp}
      </div>
      <div>
        {lowTemp}
      </div>
      <div>
        {pop}
      </div>
      <div>
        {cloudCover}
      </div>
      <div>
        {windDirection} {windSpeed}
      </div>
      <div>
        {forecastCreationDate}
      </div>
      {(additionalForecastHistoryArray) ?
        <NestedForecastHistory
          forecastHistoryArray={additionalForecastHistoryArray}
        />
        :
        null
      }
    </li>
  )
}