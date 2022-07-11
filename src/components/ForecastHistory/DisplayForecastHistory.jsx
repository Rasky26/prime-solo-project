// Import the core libraries and functions
import moment from "moment"
import { useSelector } from "react-redux"


// Component that displays the forecast history for the
// various dates
export default function DisplayForecastHistory({ forecastHistoryObj }) {

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
  const forecastForDate = moment(forecastHistoryObj.forecast_for_date).format('dddd, MMM Do YYYY')
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
  const forecastCreationDate = moment(forecastHistoryObj.created_on).calendar()


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
    </li>
  )
}